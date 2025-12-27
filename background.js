async function injectPrivacyToast(tabId) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: analyzeAndShowToast
    });
  } catch (e) {
    // ignore restricted pages
  }
}

// Page load
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url?.startsWith("http")) {
    injectPrivacyToast(tabId);
  }
});

// Tab switch
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (tab.url?.startsWith("http")) {
      injectPrivacyToast(tab.id);
    }
  });
});
function analyzeAndShowToast() {
  if (document.getElementById("privacy-toast")) return;

  const entries = performance.getEntriesByType("resource");
  const pageDomain = location.hostname;
  const thirdParty = new Set();

  entries.forEach(e => {
    try {
      const domain = new URL(e.name).hostname;
      if (domain !== pageDomain && !domain.endsWith("." + pageDomain)) {
        thirdParty.add(domain);
      }
    } catch {}
  });

  const thirdPartyCount = thirdParty.size;

  // Simple risk logic (same spirit as popup)
  let risk = "safe";
  let signal = "🟢";
  let bgColor = "#ecfdf5";
  let textColor = "#065f46";
  let label = "Safe";

  if (thirdPartyCount >= 10) {
    risk = "risky";
    signal = "🔴";
    bgColor = "#fef2f2";
    textColor = "#991b1b";
    label = "Risky";
  } else if (thirdPartyCount >= 4) {
    risk = "medium";
    signal = "🟡";
    bgColor = "#fffbeb";
    textColor = "#92400e";
    label = "Moderate";
  }

  const toast = document.createElement("div");
  toast.id = "privacy-toast";
  toast.innerHTML = `
    <div style="font-weight:600; font-size:13px;">
      ${signal} Privacy Check
    </div>
    <div style="font-size:12px; margin-top:2px;">
      Tracking level: <b>${label}</b>
    </div>
  `;

  // 🔥 TOP-RIGHT POSITION
  toast.style.position = "fixed";
  toast.style.top = "16px";
  toast.style.right = "16px";
  toast.style.padding = "10px 14px";
  toast.style.background = bgColor;
  toast.style.color = textColor;
  toast.style.borderRadius = "10px";
  toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  toast.style.fontFamily =
    "system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  toast.style.zIndex = "999999";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

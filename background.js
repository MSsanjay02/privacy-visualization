function injectToast(tabId) {
  chrome.scripting.executeScript({
    target: { tabId },
    func: analyzeAndShowToast
  }).catch(() => {});
}

// When page finishes loading
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url?.startsWith("http")) {
    injectToast(tabId);
  }
});

// When switching tabs
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (tab.url?.startsWith("http")) {
      injectToast(tab.id);
    }
  });
});

// Runs INSIDE the webpage
function analyzeAndShowToast() {
  if (document.getElementById("privacy-toast")) return;

  // --- ANALYZE ---
  const resources = performance.getEntriesByType("resource");
  const pageDomain = location.hostname;
  const thirdParty = new Set();

  resources.forEach(r => {
    try {
      const d = new URL(r.name).hostname;
      if (d !== pageDomain && !d.endsWith("." + pageDomain)) {
        thirdParty.add(d);
      }
    } catch {}
  });

  const trackers = thirdParty.size;

  // Estimate cookies
  const cookieCount = document.cookie
    ? document.cookie.split(";").length
    : 0;

  // --- RISK LOGIC ---
  let color = "#ecfdf5";
  let text = "#065f46";
  let label = "Safe";
  let icon = "🟢";

  if (trackers >= 10) {
    color = "#fef2f2";
    text = "#991b1b";
    label = "Risky";
    icon = "🔴";
  } else if (trackers >= 4) {
    color = "#fffbeb";
    text = "#92400e";
    label = "Moderate";
    icon = "🟡";
  }

  // --- TOAST UI ---
  const toast = document.createElement("div");
  toast.id = "privacy-toast";
  toast.innerHTML = `
    <div style="font-weight:600;font-size:13px;">
      ${icon} ${label} Website
    </div>
    <div style="font-size:12px;margin-top:4px;">
      🍪 Cookies: ${cookieCount}<br/>
      🌐 Trackers: ${trackers}
    </div>
  `;

  toast.style.position = "fixed";
  toast.style.top = "16px";
  toast.style.right = "16px";
  toast.style.background = color;
  toast.style.color = text;
  toast.style.padding = "10px 14px";
  toast.style.borderRadius = "10px";
  toast.style.fontFamily = "system-ui, sans-serif";
  toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  toast.style.zIndex = "999999";

  document.body.appendChild(toast);

  // Auto close after 3 seconds
  setTimeout(() => toast.remove(), 3000);
}

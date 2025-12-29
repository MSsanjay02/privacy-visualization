document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.url.startsWith("http")) {
    document.getElementById("result").textContent =
      "Not available on this page";
    return;
  }

  const hostname = new URL(tab.url).hostname;

  chrome.storage.session.get("privacy_" + hostname, async (data) => {
    const info = data["privacy_" + hostname];

    if (!info) {
      document.getElementById("result").textContent =
        "Analyzing website… Please reload the page.";
      return;
    }

    const cookieCount = await getCookieCount(tab.url);

    let className = "safe";
    if (info.risk === "Moderate") className = "medium";
    if (info.risk === "Risky") className = "risky";

    document.getElementById("result").innerHTML = `
      🍪 Cookies: ${cookieCount}<br/>
      🌐 Third-Party Domains: ${info.thirdPartyCount}<br/>
      <b class="${className}">Risk Level: ${info.risk}</b>
    `;
  });
});

function getCookieCount(url) {
  return new Promise(resolve => {
    try {
      const domain = new URL(url).hostname;
      chrome.cookies.getAll({ domain }, cookies => {
        resolve(cookies.length);
      });
    } catch {
      resolve(0);
    }
  });
}

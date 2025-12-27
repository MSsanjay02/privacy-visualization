document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.runtime.sendMessage(
    { action: "analyzeSite", tabId: tab.id },
    async (response) => {
      const thirdPartyCount = response.thirdParty.length;
      const cookieCount = await getCookieCount(tab.url);

      const score = cookieCount * 1 + thirdPartyCount * 5;

      let risk = "🟢 Safe";
      let className = "safe";

      if (score >= 40) {
        risk = "🔴 Risky";
        className = "risky";
      } else if (score >= 15) {
        risk = "🟡 Moderate";
        className = "medium";
      }

      document.getElementById("result").innerHTML = `
        🍪 Cookies: ${cookieCount}<br/>
        🌐 Third-Party Domains: ${thirdPartyCount}<br/>
        <b class="${className}">Risk Level: ${risk}</b>
      `;
    }
  );
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

document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.url.startsWith("http")) {
    document.getElementById("result").textContent =
      "Not available on this page";
    return;
  }

  // 1️⃣ Ask background to analyze the site
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: collectPrivacyData
    },
    async (results) => {
      if (chrome.runtime.lastError || !results?.[0]?.result) {
        document.getElementById("result").textContent =
          "Unable to analyze this site";
        return;
      }

      const { thirdPartyCount } = results[0].result;
      const cookieCount = await getCookieCount(tab.url);

      // 2️⃣ Risk logic (same as before)
      let risk = "🟢 Safe";
      let className = "safe";

      const score = cookieCount * 1 + thirdPartyCount * 5;

      if (score >= 40) {
        risk = "🔴 Risky";
        className = "risky";
      } else if (score >= 15) {
        risk = "🟡 Moderate";
        className = "medium";
      }

      // 3️⃣ Render data (same snapshot as earlier)
      document.getElementById("result").innerHTML = `
        🍪 Cookies: ${cookieCount}<br/>
        🌐 Third-Party Domains: ${thirdPartyCount}<br/>
        <b class="${className}">Risk Level: ${risk}</b>
      `;
    }
  );
});

function collectPrivacyData() {
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

  return {
    thirdPartyCount: thirdParty.size
  };
}

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

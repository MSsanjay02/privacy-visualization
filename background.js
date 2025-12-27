chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "analyzeSite") {
    chrome.scripting.executeScript(
      {
        target: { tabId: msg.tabId },
        func: collectDomains
      },
      (results) => {
        if (chrome.runtime.lastError) {
          sendResponse({ thirdParty: [] });
          return;
        }
        sendResponse(results[0].result);
      }
    );
    return true; // keep message channel open
  }
});

function collectDomains() {
  const entries = performance.getEntriesByType("resource");
  const pageDomain = location.hostname;
  const thirdParty = new Set();

  entries.forEach(entry => {
    try {
      const domain = new URL(entry.name).hostname;
      if (
        domain !== pageDomain &&
        !domain.endsWith("." + pageDomain)
      ) {
        thirdParty.add(domain);
      }
    } catch {}
  });

  return {
    thirdParty: Array.from(thirdParty)
  };
}

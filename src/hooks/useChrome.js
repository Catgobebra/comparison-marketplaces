/* global chrome */
export function useChrome() {
  const openComparePage = async () => {
    try {
      if (typeof chrome !== "undefined" && chrome.tabs?.create) {
        chrome.tabs.create({
          url: chrome.runtime.getURL("index.html#/comparison"),
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return { openComparePage };
}

// Store media URLs per tab
// { tabId: [urls] }
let mediaStore = {};

// Load stored data on startup
browser.storage.local.get(['mediaStore'], (result) => {
  if (result.mediaStore) {
    mediaStore = result.mediaStore;
  }
});

// Listener for web requests
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    const { tabId, url } = details;

    // Ignore requests from tabs that don't exist (e.g., background processes)
    if (tabId === -1) {
      return;
    }

    browser.storage.sync.get({
      detectMp3: true,
      detectMp4: true,
      detectJpg: true,
      detectPng: true
    }, (options) => {
      const lowerUrl = url.toLowerCase();
      let isMedia = false;

      if (options.detectMp3 && lowerUrl.endsWith('.mp3')) isMedia = true;
      if (options.detectMp4 && lowerUrl.endsWith('.mp4')) isMedia = true;
      if (options.detectJpg && (lowerUrl.endsWith('.jpg') || lowerUrl.endsWith('.jpeg'))) isMedia = true;
      if (options.detectPng && lowerUrl.endsWith('.png')) isMedia = true;

      if (isMedia) {
        if (!mediaStore[tabId]) {
          mediaStore[tabId] = [];
        }
        if (!mediaStore[tabId].includes(url)) {
          mediaStore[tabId].push(url);
          browser.storage.local.set({ mediaStore: mediaStore });
        }
      }
    });
  },
  { urls: ["<all_urls>"] }
);

// Clean up stored data when a tab is closed
browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (mediaStore[tabId]) {
    delete mediaStore[tabId];
    browser.storage.local.set({ mediaStore: mediaStore });
  }
});

// Clean up when a tab is updated (e.g., navigated to a new page)
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // a new page is loading
    if (changeInfo.status === 'loading') {
        if (mediaStore[tabId]) {
            mediaStore[tabId] = [];
            browser.storage.local.set({ mediaStore: mediaStore });
        }
    }
});

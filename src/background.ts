// Background script for Chrome extension
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Open the expanded view when extension is first installed
    chrome.tabs.create({
      url: chrome.runtime.getURL('home.html')
    });
  }
});

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openExpandedView') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('home.html')
    });
    sendResponse({ success: true });
  }
});

// Keep service worker alive
chrome.runtime.onStartup.addListener(() => {
  console.log('Octra Wallet extension started');
});
chrome.browserAction.onClicked.addListener(tab => {
  chrome.debugger.attach({tabId:tab.id}, '1.0',
      () => chrome.windows.create({url: 'fetch.html?' + tab.id, type: 'popup', width: 600, height: 1000}));
});

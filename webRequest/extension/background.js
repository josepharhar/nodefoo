console.log('hello from test extension');

const filter = {
  urls: ['<all_urls>']
};
const opt_extraInfoSpec = [
  'extraHeaders',
  'blocking',
  'responseHeaders'
];
function logEvent(name, event) {
  console.log(`${name}: ${JSON.stringify(event, null, 2)}\n`);
}

chrome.webRequest.onBeforeRequest.addListener(
    logEvent.bind(this, 'onBeforeRequest'),
    filter, opt_extraInfoSpec);
chrome.webRequest.onBeforeSendHeaders.addListener(
    logEvent.bind(this, 'onBeforeSendHeaders'),
    filter, opt_extraInfoSpec);
chrome.webRequest.onSendHeaders.addListener(
    logEvent.bind(this, 'onSendHeaders'),
    filter, opt_extraInfoSpec);
chrome.webRequest.onHeadersReceived.addListener(
    logEvent.bind(this, 'onHeadersReceived'),
    filter, opt_extraInfoSpec);
chrome.webRequest.onAuthRequired.addListener(
    logEvent.bind(this, 'onAuthRequired'),
    filter, opt_extraInfoSpec);
chrome.webRequest.onBeforeRedirect.addListener(
    logEvent.bind(this, 'onBeforeRedirect'),
    filter, opt_extraInfoSpec);
chrome.webRequest.onResponseStarted.addListener(
    logEvent.bind(this, 'onResponseStarted'),
    filter, opt_extraInfoSpec);
chrome.webRequest.onCompleted.addListener(
    logEvent.bind(this, 'onCompleted'),
    filter, opt_extraInfoSpec);

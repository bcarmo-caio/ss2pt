const locale = 'pt-BR,pt';

let extraInfoSpec = ["blocking", "requestHeaders"];

if (chrome.webRequest.OnBeforeSendHeadersOptions.hasOwnProperty('EXTRA_HEADERS')) {
  extraInfoSpec.push('extraHeaders');
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(HEADERS_INFO) {
    for (var header of HEADERS_INFO.requestHeaders) {
      if (header.name == "Accept-Language") {
          header.value = locale;
      }
    }

    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {language: locale});
      }
    );

    return { requestHeaders: HEADERS_INFO.requestHeaders };
  },
  {
    urls: ["<all_urls>"]
  },
  extraInfoSpec
);


//Listen for redirect requests
chrome.runtime.onMessage.addListener(function(request, sender) {
  chrome.tabs.update(sender.tab.id, {url: request.redirect});
  return;
});

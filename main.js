function getCurrentTabUrl(callback) {

  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;

    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

}

function getVideoId(url) {

  var re = /https?:\/\/www.youtube.com\/watch\?v=([^&]+)/;
  var found = url.match(re);
  return found ? found[1] : null;

}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    var videoId = getVideoId(url);
    if (videoId) {
      // make GET request
    } else {
      renderStatus('URL not valid. Could not retrieve video ID.');
    }
  });
});

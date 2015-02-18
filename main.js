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

function fetchComments(id, cb) {
  var requestUrl = 'http://gdata.youtube.com/feeds/api/videos/' + id + '/comments';
  var x = new XMLHttpRequest();
  x.open('GET', requestUrl);
  x.responseType = 'document';
  x.onload = function() {
    var response = x.response;
    cb(response);
  };
  x.onerror = function() {
    renderStatus('Failed to fetch comments.');
  };
  x.send();
}

// http://davidwalsh.name/convert-xml-json
function xmlToJson(xml) {
  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
    obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        // Chrome console says nodeValue is deprecated, but using 'value' instead breaks function
      }
    }
  } else if (xml.nodeType == 3) { // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for(var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof(obj[nodeName]) == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof(obj[nodeName].push) == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function searchComments(commentsArr, str) {
  var results = [];
  var re = new RegExp(str, 'gi');
  commentsArr.forEach(function(comment) {
    if (comment.content['#text'].match(re)) {
      results.push(comment);
    }
  });
  return results;
}

function renderComments(commentsArr) {
  var container = document.getElementById('comments');
  if (commentsArr.length) {
    commentsArr.forEach(function(comment) {
      var author = comment.author.name['#text'];
      var text = comment.content['#text'];

      var span = document.createElement('span');
      span.className = 'author';
      var spanText = document.createTextNode(author);
      span.appendChild(spanText);

      var div = document.createElement('div');
      div.className = 'comment';
      var divText = document.createTextNode(text);
      div.appendChild(divText);

      container.appendChild(span);
      container.appendChild(div);
    });
  }
}

function getUserInput() {
  return document.getElementById('form').elements['userInput'].value;
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('form').addEventListener('submit', function(e) {
    e.preventDefault();

    getCurrentTabUrl(function(url) {
      var videoId = getVideoId(url);
      if (videoId) {
        fetchComments(videoId, function(response) {
          var json = xmlToJson(response);
          var comments = json.feed.entry;
          var userInput = getUserInput();
          var found = searchComments(comments, userInput);
          renderComments(found);
        });
      } else {
        renderStatus('URL not valid. Could not retrieve video ID.');
      }
    });
  });
});

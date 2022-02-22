//var XMLHttpRequest = require('xhr2');
var oReq = new XMLHttpRequest();
var currentURL = ''

try{
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request) {
      (async () => {
        const returnData = await handleMessage(request);
        console.log(returnData);
        sendResponse({ sender: "messenger.ts", data: returnData});
      })();
      return true;
    }
  });
} catch(e) {
  console.log(e);
}

try {
  chrome.tabs.onActivated.addListener( function(activeInfo){
    chrome.tabs.get(activeInfo.tabId, function(tab){
        y = tab.url;
        currentURL = y.replace('https://www.youtube.com/watch?v=', '');
    });
  });
} catch(e) {
  console.log(e);
}

function handleMessage(request) {
  const [msgType, ...rest] = request.msg.split("-");
  const msgData = rest.join('-');
  console.log(msgType);
  console.log(msgData);
  return new Promise((resolve, reject) => {
    if (msgType == "add") {
      addToData(msgData);
      resolve("received");
    } else if (msgType == "get") {
      (async () => {
        const ratingData = await getData(msgData);
        resolve(ratingData);
      })();
      return true;
    } else if(msgType == 'URL') {
      resolve('{"URL":"' + currentURL + '"}');
    } else {
      reject("invalid message type");
    }
  })  
}

function addToData(dataName) {
  oReq.open("POST", "http://localhost:5000/add-rating?rating-type=" + dataName + "&rating=1&username=extensionTest&video-url=" + currentURL);
  oReq.send();
}

function getData(videoURL) {
  oReq.open("GET", "http://localhost:5000/get-rating?video-url=" + videoURL);
  return new Promise((resolve, reject) => {
    oReq.onload = function() {
      if (oReq.readyState === 4) {
        if (oReq.statusText === 'OK') {
          console.log("resolved");
          resolve(oReq.responseText);
        } else {
          console.log('rejected');
          reject(oReq.statusText);
        }
      }
    }
    oReq.send();
  })
}

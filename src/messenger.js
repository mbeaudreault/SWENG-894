var XMLHttpRequest = require('xhr2');
var oReq = new XMLHttpRequest();

try{
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request) {
      if (request.msg.split("-", 1)[0] == "add") {
        addToData(request.msg.split("-", 2)[1]);
        sendResponse({ sender: "messenger.ts", data: "received"});
      } else if (request.msg.split("-", 1)[0] == "get") {
        (async () => {
          const ratingData = await getData(request.msg.split("-", 2)[1]);
          sendResponse({sender: "messenger.ts", data: ratingData});
        })();
        return true;
      }
    }
  });
} catch(e) {
  console.log(e);
}

function addToData(dataName) {
  oReq.open("POST", "http://localhost:5000/add-rating?rating-type=" + dataName + "&rating=1&username=extensionTest&video-url=extensionTest");
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

export { addToData, getData };

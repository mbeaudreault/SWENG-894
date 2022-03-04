//var XMLHttpRequest = require('xhr2');
//var oReq = new XMLHttpRequest();

class MessageHandler {
  constructor() {
    this.currentURL = "";
    this.currentUserName = "";
    this.currentUserRatingData = {}
  }

  setCurrentURL(URL) {
    this.currentURL = URL;
  }

  handleMessage(request, requester) {
    const [msgType, ...rest] = request.msg.split("-");
    const msgData = rest.join('-');
    return new Promise((resolve, reject) => {
      if (msgType == "add") {
        this.addToData(msgData, requester);
        resolve("received");
      } else if (msgType == "get") {
        (async () => {
          const ratingData = await this.getData(msgData, requester);
          resolve(ratingData);
        })();
        return true;
      } else if(msgType == 'URL') {
        resolve('{"URL":"' + this.currentURL + '"}');
      } else if(msgType == 'username') {
        this.currentUserName = msgData;
      } else if (msgType == 'getUserRating') {
        (async () => {
          const ratingData = await this.getUserRatingData(requester);
          this.currentUserRatingData = JSON.parse(ratingData);
          resolve(ratingData);
        })();
      }else {
        reject("invalid message type");
      }
    })
  }
  
  addToData(dataName, requester) {
    if (this.currentUserRatingData[dataName]) {
      this.currentUserRatingData[dataName] -= 1;
    } else {
      this.currentUserRatingData[dataName] += 1;
    }
    requester.open("POST", "http://localhost:5000/add-rating?rating-type=" + dataName + "&rating=" + this.currentUserRatingData[dataName] + "&username=" + this.currentUserName + "&video-url=" + this.currentURL);
    requester.send();
  }
  
  getData(videoURL, requester) {
    requester.open("GET", "http://localhost:5000/get-rating?video-url=" + videoURL);
    return new Promise((resolve, reject) => {
      requester.onload = function() {
        if (requester.readyState === 4) {
          if (requester.statusText === 'OK') {
            console.log("resolved");
            resolve(requester.responseText);
          } else {
            console.log('rejected');
            reject(requester.statusText);
          }
        }
      }
      requester.send();
    })
  }

  getUserRatingData(requester) {
    requester.open("GET", "http://localhost:5000/get-rating?video-url=" + this.currentURL + "&username=" + this.currentUserName)
    return new Promise((resolve, reject) => {
      requester.onload = function() {
        if (requester.readyState === 4) {
          if (requester.statusText === 'OK') {
            console.log("resolved");
            resolve(requester.responseText);
          } else {
            console.log('rejected');
            reject(requester.statusText);
          }
        }
      }
      requester.send();
    })
  }
}


const msgHandler = new MessageHandler();

try{
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request) {
      (async () => {
        const returnData = await msgHandler.handleMessage(request, oReq);
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
        let currentURL = y.replace('https://www.youtube.com/watch?v=', '');
        msgHandler.setCurrentURL(currentURL);
    });
  });
} catch(e) {
  console.log(e);
}

export { MessageHandler };
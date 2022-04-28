//var XMLHttpRequest = require('xhr2');
//var oReq = new XMLHttpRequest();

class MessageHandler {
  constructor() {
    this.currentURL = "";
    this.currentUserName = "";
    this.currentUserRatingData = {"is_liked": 0,
                                  "is_disliked": 0,
                                  "is_misinformation": 0,
                                  "is_did_not_work": 0,
                                  "is_outdated": 0,
                                  "is_offensive": 0,
                                  "is_immoral": 0}
  }

  handleMessage(request, requester) {
    const [videoURL, msgType, ...rest] = request.msg.split("-");
    console.log(videoURL + " " + msgType + " " + rest);
    const msgData = rest.join('-');
    return new Promise((resolve, reject) => {
      if (msgType == "add") {
        (async () => {
          const ratingData = await this.getUserRatingData(requester, videoURL);
          this.currentUserRatingData = JSON.parse(ratingData);
          await this.addToData(msgData, requester, videoURL);
          resolve("received");
        })();
      } else if (msgType == "get") {
        (async () => {
          const ratingData = await this.getData(videoURL, requester);
          resolve(ratingData);
        })();
        return true;
      } else if(msgType == 'username') {
        this.currentUserName = msgData;
      } else if (msgType == 'getUserRating') {
        (async () => {
          const ratingData = await this.getUserRatingData(requester);
          this.currentUserRatingData = JSON.parse(ratingData);
          resolve(ratingData);
        })();
      } else if(msgType == 'getRatioDiff') {
        (async() => {
          const ratioDiffData = await this.getRatioDiffFromGlobal(requester, videoURL);
          resolve(ratioDiffData);
        })();
      } else if (msgType == 'getRankingData') {
        (async () => {
          const rankData = await this.getRankingData(requester, videoURL);
          resolve(rankData);
        })();
      } else {
        console.log("msgType " + msgType)
        reject("invalid message type");
      }
    })
  }
  
  addToData(dataName, requester, videoURL) {
    if (this.currentUserRatingData[dataName]) {
      this.currentUserRatingData[dataName] -= 1;
    } else {
      this.currentUserRatingData[dataName] += 1;
    }
    requester.open("POST", "http://localhost:5000/add-rating?rating-type=" + dataName + "&rating=" + this.currentUserRatingData[dataName] + "&username=" + this.currentUserName + "&video-url=" + videoURL);
    requester.send();
    return new Promise((resolve, reject) => {
      requester.onload = function() {
        if (requester.readyState === 4) {
          if (requester.statusText === 'OK') {
            resolve("resolved");
          } else {
            reject("rejected");
          }
        }
      }
    })
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

  getUserRatingData(requester, videoURL) {
    requester.open("GET", "http://localhost:5000/get-user-rating?video-url=" + videoURL + "&username=" + this.currentUserName);
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

  getRatioDiffFromGlobal(requester, videoURL) {
    requester.open("GET", "http://localhost:5000/get-ratio-diff-from-global?video-url=" + videoURL);
    return new Promise((resolve, reject) => {
      requester.onload = function() {
        if(requester.readyState === 4) {
          if (requester.statusText === 'OK') {
            resolve(requester.responseText);
          } else {
            reject(requester.statusText);
          }
        }
      }
      requester.send();
    })
  }

  getRankingData(requester, videoURL) {
    requester.open("GET", "http://localhost:5000/get-video-ranking?video-url=" + videoURL);
    return new Promise((resolve, reject) => {
      requester.onload = function() {
        if(requester.readyState === 4) {
          if (requester.statusText === 'OK') {
            resolve(requester.responseText);
          } else {
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
        sendResponse({ sender: "messenger.ts", data: returnData});
      })();
      return true;
    }
  });
} catch(e) {
  console.log(e);
}

export { MessageHandler };
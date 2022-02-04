const ratingNumMap = new Map();
ratingNumMap.set('numLikes', 0);
ratingNumMap.set('numDislikes', 0);
ratingNumMap.set('numMisinformation', 0);
ratingNumMap.set('numDidNotWork', 0);
ratingNumMap.set('numOutdated', 0);
ratingNumMap.set('numOffensive', 0);
ratingNumMap.set('numImmoral', 0);

try{
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request) {
      if (request.msg.split("-", 1)[0] == "add") {
        addToData(request.msg.split("-", 2)[1]);
        sendResponse({ sender: "messenger.ts", data: "received"});
      } else if (request.msg.split("-", 1)[0] == "get") {
        numData = getData(request.msg.split("-", 2)[1]);
        sendResponse({sender: "messenger.ts", data: numData});
      }
    }
  });
} catch(e) {
  console.log(e);
}

function addToData(dataName) {
  ratingNumMap.set(dataName, ratingNumMap.get(dataName) + 1);
}

function getData(dataName) {
  return ratingNumMap.get(dataName);
}

export { addToData, getData };

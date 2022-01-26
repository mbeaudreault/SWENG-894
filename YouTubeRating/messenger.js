chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request) {
    console.log("msg received");
    if (request.msg == "user-liked") {
      console.log("msg received");
      sendResponse({ sender: "messenger.ts", data: "received"});
    }
  }
});

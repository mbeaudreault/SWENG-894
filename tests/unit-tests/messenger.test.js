import 'jest';
import  { MessageHandler } from "../../src/messenger";


class MockRequester {
  constructor() {
    this.responseText = "";
    this.statusText = "";
    this.lastAddress = "";
    this.lastMsgType = "";
  }

  open (msgType, address) {
    this.lastAddress = address;
    this.lastMsgType = msgType;
  }

  send() {

  }

  onload() {
    return true;
  }
}

class MockRequest {
  constructor(msg) {
    this.msg = msg;
  }
}


it ("addToData Test", () => {
  const mockRequester = new MockRequester();
  const msgHandler = new MessageHandler();
  msgHandler.addToData("is_liked", mockRequester);
  expect(mockRequester.lastAddress).toBe("http://localhost:5000/add-rating?rating-type=is_liked&rating=1&username=&video-url=");
});

it ("getData Test", () => {
  const mockRequester = new MockRequester();
  const msgHandler = new MessageHandler();
  msgHandler.getData("test_url", mockRequester);

  expect(mockRequester.lastAddress).toBe("http://localhost:5000/get-rating?video-url=test_url");
})

it ("getUserData Test", () => {
  const mockRequester = new MockRequester();
  const msgHandler = new MessageHandler();
  msgHandler.getUserRatingData(mockRequester);

  expect(mockRequester.lastAddress).toBe("http://localhost:5000/get-user-rating?video-url=&username=");
})

it ("getRatioDiffFromGlobal Test", () => {
  const mockRequester = new MockRequester();
  const msgHandler = new MessageHandler();
  msgHandler.getRatioDiffFromGlobal(mockRequester);

  expect(mockRequester.lastAddress).toBe("http://localhost:5000/get-ratio-diff-from-global?video-url=");
})

it ("getRankingData Test", () => {
  const mockRequester = new MockRequester();
  const msgHandler = new MessageHandler();
  msgHandler.getRankingData(mockRequester);

  expect(mockRequester.lastAddress).toBe("http://localhost:5000/get-video-ranking?video-url=");
})

it ("handleMessage Test", () => {
  const mockRequester = new MockRequester();
  const msgHandler = new MessageHandler();

  const mockRequest2 = new MockRequest("URL");
  msgHandler.handleMessage(mockRequest2, mockRequester);
})

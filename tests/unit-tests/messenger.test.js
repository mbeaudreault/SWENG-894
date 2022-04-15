import 'jest';
import { TestWatcher } from 'jest';
import  { MessageHandler } from "../../src/messenger";
require('regenerator-runtime/runtime');


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
  msgHandler.addToData("is_liked", mockRequester, "testURL");
  expect(mockRequester.lastAddress).toBe("http://localhost:5000/add-rating?rating-type=is_liked&rating=1&username=&video-url=testURL");
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
  msgHandler.getUserRatingData(mockRequester, "testURL");

  expect(mockRequester.lastAddress).toBe("http://localhost:5000/get-user-rating?video-url=testURL&username=");
})

it ("getRatioDiffFromGlobal Test", () => {
  const mockRequester = new MockRequester();
  const msgHandler = new MessageHandler();
  msgHandler.getRatioDiffFromGlobal(mockRequester, "testURL");

  expect(mockRequester.lastAddress).toBe("http://localhost:5000/get-ratio-diff-from-global?video-url=testURL");
})

it ("getRankingData Test", () => {
  const mockRequester = new MockRequester();
  const msgHandler = new MessageHandler();
  msgHandler.getRankingData(mockRequester, "testURL");

  expect(mockRequester.lastAddress).toBe("http://localhost:5000/get-video-ranking?video-url=testURL");
})

it ("handleMessage Test", async() => {
  const mockRequester = new MockRequester();
  const msgHandler = new MessageHandler();

  const mockRequest1 = new MockRequest("testURL-get-fakeurl");
  msgHandler.handleMessage(mockRequest1, mockRequester);

  const mockRequest3 = new MockRequest("testURL-username-testuserName");
  msgHandler.handleMessage(mockRequest3, mockRequester);

  const mockRequest4 = new MockRequest("testURL-getUserRating-fakeURL");
  msgHandler.handleMessage(mockRequest4, mockRequester);

  const mockRequest5 = new MockRequest("testURL-getRatioDiff-fakeURL");
  msgHandler.handleMessage(mockRequest5, mockRequester);

  const mockRequest6 = new MockRequest("testURL-getRankingData-fakeURL");
  msgHandler.handleMessage(mockRequest6, mockRequester);

})

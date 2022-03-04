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
  expect(mockRequester.lastAddress).toBe("http://localhost:5000/add-rating?rating-type=is_liked&rating=NaN&username=&video-url=");
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

  expect(mockRequester.lastAddress).toBe("http://localhost:5000/get-rating?video-url=&username=");
})

it ("handleMessage Test", () => {
  const mockRequester = new MockRequester();
  const msgHandler = new MessageHandler();

  const mockRequest1 = new MockRequest("add-isliked");
  msgHandler.handleMessage(mockRequest1, mockRequester);

  const mockRequest2 = new MockRequest("URL");
  msgHandler.handleMessage(mockRequest2, mockRequester);
})

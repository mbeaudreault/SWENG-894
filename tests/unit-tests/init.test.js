import 'jest';
import { fnDefineEvents, fnAddButtons, addTextNode, getData, addTextEdit, constructButton, sendValueFromID, calculateEstimatedDislikes, getNumYTLikes, updateButtonText, convertYTTimeStampToMiliSeconds, enableButtons } from "../../src/init";


class mockStyle {
  constructor() {
    this.background = "no color";
  }
}


class MockText {
  constructor(value) {
    this.value = value;
  }
}


class MockButton {

  constructor(btnId, btnValue, btnType, btnColor) {
    this.id = btnId;
    this.value = btnValue;
    this.type = btnType;
    this.style = new mockStyle();
    this.disabled = true;
    this.color = btnColor
  }

  addEventListener(eventName, funct) {
    return 1;
  }
}

class MockDocument {

  constructor() {
    this.buttons = [];
    this.children = [];
  }

  createElement(eleName) {
    if (eleName === "input") {
      const newButton = new MockButton("this", "should", "change", "after");
      this.addButton(newButton);
      return newButton;
    } else if (eleName === "div") {
      const newDiv = new MockElement("div");
      this.children.push(newDiv);
      return newDiv;
    } else if (eleName === "INPUT") {
      const newTextEdit = new MockElement("textEdit");
      this.children.push(newTextEdit);
      return newTextEdit;
    }
  }

  getElementById(id) {
    for (var i = 0; i < this.buttons.length; i++) {
      if (this.buttons[i].id === id) {
        return this.buttons[i];
      }
    }
    return -1;
  }

  addButton(button){
    this.buttons.push(button);
  }

  createTextNode(value) {
    const newText = new MockText(value);
    return newText;
  }

  querySelector(id) {
    const ele = new MockElement(id);
    this.children.push(ele);
    return ele;
  }
}

class MockRuntime {
  sendMessage(msg) {
    return 1;
  }
}

class MockChrome {

  constructor() {
    this.runtime = new MockRuntime
  }
}

class MockElement {

  constructor(eleId) {
    this.id = eleId;
    this.ariaLabel = 1;
    this.children = [];
  }

  appendChild(ele) {
    this.children.push(ele);
  }
}

it ("defineEvents executes", () => {
  const doc = new MockDocument();
  const mockChrome = new MockChrome();
  const mockLikeBtn = new MockButton("like-btn", "like", "value");
  const mockDisLikeBtn = new MockButton("dislike-btn", "dislike", "value");
  doc.addButton(mockLikeBtn);
  doc.addButton(mockDisLikeBtn);

  fnDefineEvents("like-btn", "add-numLikes", doc, mockChrome, "testType1", "testText1");
  fnDefineEvents("dislike-btn", "add-numDislikes", doc, mockChrome, "testType2", "testText2");
});

it ("addButtons test", () => {
  const doc = new MockDocument();
  fnAddButtons(doc, "test-name", "test-id", "div[id='top-level-buttons-computed']");
  expect(doc.children[0].children[0]).toBeDefined();
  expect(doc.children[0].children[0].id).toBe("test-id");
  fnAddButtons(doc, 'test_flag', 'test_flag_id', "div[id='info-contents']");
  expect(doc.children[0].children[0].id).toBe("test-id");
})

it ("addTextNode test", () => {
  const doc = new MockDocument();

  addTextNode(doc, "test1", "test_location");
  expect(doc.children[0].children[0]).toBeDefined();
  expect(doc.children[0].children[0].value).toBe("test1");
})

it ("addTextEdit test", () => {
  const doc = new MockDocument();

  addTextEdit(doc, "test1", "test_location");
  expect(doc.children[1].children[0]).toBeDefined();
  expect(doc.children[1].children[0].id).toBe("test1");
})

it ('constructButton test', () => {
  const doc = new MockDocument();
  const mChrome = new MockChrome();

  constructButton(doc, "1", "test1", "testID", "test_loc", "test_msg", mChrome, "testType1", "testText1");
  expect(doc.children[0]).toBeDefined();
  expect(doc.children[0].children[0].value).toBe("test1 +1");
})

it ("getData test", () => {
  const mockChrome = new MockChrome();
  const data = getData(mockChrome, "get-test_video");
})

it ("sendValueFromID test", () => {
  const mockChrome = new MockChrome();
  const mockDocument = new MockDocument();
  fnAddButtons(mockDocument, "test-name", "test-id1", "div[id='top-level-buttons-computed']");
  sendValueFromID(mockChrome, mockDocument, "test-id1");
})

it ("getNumYTLikes test", () => {
  const mockDocument = new MockDocument();

  const numLikes = getNumYTLikes(mockDocument);
  expect(numLikes).toBe(1);
})

it ("calculateEstimatedDislikes test", () => {
  let estDislikes = calculateEstimatedDislikes(1, 0, 1);
  expect(estDislikes).toBe("More Data Needed");

  estDislikes = calculateEstimatedDislikes("100 likes", 10, 3);
  expect(estDislikes).toBe(30);
})

it ("updateBttonText test", () => {
  const mockChrome = new MockChrome();
  const mockDocument = new MockDocument();
  const mockLikeBtn = new MockButton("like-btn", "like", "value");
  mockDocument.addButton(mockLikeBtn);

  //updateButtonText(mockChrome, mockDocument, "like-btn", "is_liked", "testText");
})

it ("convertYTTimeStampToMiliSeconds test", () => {
  const timeLen = '3:23';
  const newTime = convertYTTimeStampToMiliSeconds(timeLen);

  expect(newTime).toBe(203000);
})

it ("enableButton test", () => {
  const buttons = [];
  const mockDisLikeBtn = new MockButton("dislike-btn", "dislike", "value");
  buttons.push(mockDisLikeBtn);
  enableButtons(buttons);

  expect(buttons[0].disabled).toBe(false);
})

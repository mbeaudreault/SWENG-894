import 'jest';
import { fnDefineEvents, fnAddButtons, addTextNode, getData } from "../../src/init";


class MockText {
  constructor(value) {
    this.value = value;
  }
}


class MockButton {

  constructor(btnId, btnValue, btnType) {
    this.id = btnId;
    this.value = btnValue;
    this.type = btnType;
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
      const newButton = new MockButton("this", "should", "change");
      this.addButton(newButton);
      return newButton;
    } else if (eleName === "div") {
      const newDiv = new MockElement("div");
      this.children.push(newDiv);
      return newDiv;
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

  fnDefineEvents("like-btn", "add-numLikes", doc, mockChrome);
  fnDefineEvents("dislike-btn", "add-numDislikes", doc, mockChrome);
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

it ("getData test", () => {
  const mockChrome = new MockChrome();
  const data = getData(mockChrome, "get-numLikes");
})

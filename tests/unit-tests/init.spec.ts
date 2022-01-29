import 'jest';
import { fnDefineEvents, fnAddButtons } from "../../src/init";


class MockButton {
  id: string;
  value: string;
  type: string;

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
  buttons: Array<MockButton>;
  children: Array<MockElement>;

  constructor() {
    this.buttons = [];
    this.children = [];
  }

  createElement(eleName) {
    if (eleName === "input") {
      const newButton = new MockButton("this", "should", "change");
      this.addButton(newButton);
      return newButton;
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

  querySelector(id) {
    const ele = new MockElement(id);
    this.children.push(ele);
    return ele;
  }
}

class MockChrome {

}

class MockElement {
  id: string;
  children: Array<MockElement>;

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

  fnDefineEvents(doc, mockChrome);
});

it ("addButtons test", () => {
  const doc = new MockDocument();
  fnAddButtons(doc, "test-name", "test-id");
  expect(doc.children[0].children[0]).toBeDefined();
  expect(doc.children[0].children[0].id).toBe("test-id");
})

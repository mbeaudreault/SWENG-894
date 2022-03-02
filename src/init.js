function fnAddButtons(doc, value, id, inputLocation, color) {
  var btn = doc.createElement("input");
  btn.value = value;
  btn.id = id;
  btn.type = "submit";
  btn.style.background = color;
  doc.querySelector(inputLocation).appendChild(btn);
}

function addTextNode(doc, text, inputLocation) {
  const newDiv = doc.createElement("div");

  const newTextNode = doc.createTextNode(text);
  newDiv.appendChild(newTextNode);
  doc.querySelector(inputLocation).appendChild(newTextNode);
}

function addTextEdit(doc, id, inputLocation) {
  var textEdit = doc.createElement("INPUT");
  textEdit.id = id;
  doc.querySelector(inputLocation).appendChild(textEdit);
}

function fnDefineEvents(id, msg, doc, chromeVar) {
  doc
    .getElementById(id)
    .addEventListener("click", function (event) {
      sendValueFromID(chromeVar, doc, "username-textedit");
      chromeVar.runtime.sendMessage({msg: msg}, (response) => {
        if (!response) {
          console.log("not recieved");
        }else {
          console.log(response.data);
        }
      })
    });
}

function getData(chromeVar, msg) {
  return new Promise((resolve, reject) => {
    chromeVar.runtime.sendMessage({msg: msg}, (response) => {
      if (response) {
        console.log(response.data);
        resolve(JSON.parse(response.data));
      } else {
        reject("no message response");
      }
    });
  }, 4000);
}

function constructButton(doc, ratingData, name, id, inputLocation, msg, chromeVar) {
  let color = "white";
  if (ratingData > 0){
    color = "blue";
  }
  fnAddButtons(doc, name, id, inputLocation, color);
  fnDefineEvents(id, msg, doc, chromeVar);
}

function sendValueFromID(chromeVar, doc, id) {
  let elementValue = doc.getElementById(id).value;
  chromeVar.runtime.sendMessage({msg: "username-" + elementValue});
}

function getNumYTLikes(doc) {
  const likeEl = doc.querySelector("a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer yt-formatted-string[id='text']");
  return likeEl.ariaLabel;
}

function calculateEstimatedDislikes(numYTLikes, extLikes, extDislikes) {
  if (extLikes == 0) {
    return 'More Data Needed';
  } else {
    return numYTLikes * (extDislikes/extLikes);
  }
}

function main(doc, chromeVar) {
  var jsInitChecktimer = setInterval(checkForJS_Finish, 111);

  async function checkForJS_Finish () {
    if (doc.querySelector("div[id='top-level-buttons-computed']")) {
      clearInterval(jsInitChecktimer);
      const currentURL = await getData(chromeVar, 'URL');
      const ratingData = await getData(chromeVar, 'get-' + currentURL.URL);
      constructButton(doc, ratingData.is_liked, ratingData.is_liked + " like", "like-btn", "div[id='top-level-buttons-computed']", "add-is_liked", chromeVar);
      constructButton(doc, ratingData.is_disliked, ratingData.is_disliked + " dislike", "dislike-btn", "div[id='top-level-buttons-computed']", "add-is_disliked", chromeVar);
      constructButton(doc, ratingData.is_misinformation, ratingData.is_misinformation + " Misinformation", "Misinformation-flag-btn", "div[id='info-contents']", "add-is_misinformation", chromeVar);
      constructButton(doc, ratingData.is_did_not_work, ratingData.is_did_not_work + " Didn't Work", "Didn't-work-flag-btn", "div[id='info-contents']", "add-is_did_not_work", chromeVar);
      constructButton(doc, ratingData.is_outdated, ratingData.is_outdated + " Outdated", "Outdated-flag-btn",  "div[id='info-contents']", "add-is_outdated", chromeVar);
      constructButton(doc, ratingData.is_offensive, ratingData.is_offensive + " Offensive", "Offensive-flag-btn",  "div[id='info-contents']", "add-is_offensive", chromeVar);
      constructButton(doc, ratingData.is_immoral, ratingData.is_immoral + " Immoral", "Immoral-flag-btn", "div[id='info-contents']", "add-immoral", chromeVar);
      addTextNode(doc, "username: ", "div[id='info-contents']");
      addTextEdit(doc, "username-textedit", "div[id='info-contents']");
      addTextNode(doc, "password: ", "div[id='info-contents']");
      addTextEdit(doc, "password-textedit", "div[id='info-contents']");
      addTextNode(doc, calculateEstimatedDislikes(getNumYTLikes(doc), ratingData.is_liked, ratingData.is_disliked) + " Likes ", "div[id='info-contents']");
    }
  }
}

try{
  // @ts-ignore
  main(document, chrome);
} catch(e) {
  console.log(e);
}

export { fnDefineEvents, fnAddButtons, addTextNode, getData, addTextEdit, constructButton, sendValueFromID, calculateEstimatedDislikes, getNumYTLikes };
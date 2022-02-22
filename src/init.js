

function fnAddButtons(doc, value, id, inputLocation) {
  var btn = doc.createElement("input");
  btn.value = value;
  btn.id = id;
  btn.type = "submit";
  doc.querySelector(inputLocation).appendChild(btn);
}

function addTextNode(doc, text, inputLocation) {
  const newDiv = doc.createElement("div");

  const newTextNode = doc.createTextNode(text);
  newDiv.appendChild(newTextNode);
  doc.querySelector(inputLocation).appendChild(newTextNode);
}

function fnDefineEvents(id, msg, doc, chromeVar) {
  doc
    .getElementById(id)
    .addEventListener("click", function (event) {
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

function main(doc, chromeVar) {
  var jsInitChecktimer = setInterval(checkForJS_Finish, 111);

  async function checkForJS_Finish () {
    if (doc.querySelector("div[id='top-level-buttons-computed']")) {
      clearInterval(jsInitChecktimer);
      const currentURL = await getData(chromeVar, 'URL');
      console.log(currentURL.URL);
      const ratingData = await getData(chromeVar, 'get-' + currentURL.URL);
      console.log(ratingData);
      fnAddButtons(doc, ratingData.is_liked + " like", "like-btn", "div[id='top-level-buttons-computed']");
      fnDefineEvents("like-btn", "add-is_liked", doc, chromeVar);
      fnAddButtons(doc, ratingData.is_disliked + " dislike", "dislike-btn", "div[id='top-level-buttons-computed']");
      fnDefineEvents("dislike-btn", "add-is_disliked", doc, chromeVar);
      fnAddButtons(doc, ratingData.is_misinformation + " Misinformation", "Misinformation-flag-btn", "div[id='info-contents']");
      fnDefineEvents("Misinformation-flag-btn", "add-is_misinformation", doc, chromeVar);
      fnAddButtons(doc, ratingData.is_did_not_work + " Didn't Work", "Didn't-work-flag-btn", "div[id='info-contents']");
      fnDefineEvents("Didn't-work-flag-btn", "add-is_did_not_work", doc, chromeVar);
      fnAddButtons(doc, ratingData.is_outdated + " Outdated", "Outdated-flag-btn", "div[id='info-contents']");
      fnDefineEvents("Outdated-flag-btn", "add-is_outdated", doc, chromeVar);
      fnAddButtons(doc, ratingData.is_offensive + " Offensive", "Offensive-flag-btn", "div[id='info-contents']");
      fnDefineEvents("Offensive-flag-btn", "add-is_offensive", doc, chromeVar);
      fnAddButtons(doc, ratingData.is_immoral + " Immoral", "Immoral-flag-btn", "div[id='info-contents']");

      addTextNode(doc, ratingData.is_liked + " Likes ", "div[id='info-contents']");
      addTextNode(doc, ratingData.is_disliked + " Disikes", "div[id='info-contents']");
    }
  }
}

try{
  // @ts-ignore
  main(document, chrome);
} catch(e) {
  console.log(e);
}

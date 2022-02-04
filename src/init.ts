

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
        resolve(response.data);
      } else {
        reject("no message response");
      }
    });
  })
}

function main(doc, chromeVar) {
  var jsInitChecktimer = setInterval(checkForJS_Finish, 111);

  async function checkForJS_Finish () {
    if (doc.querySelector("div[id='top-level-buttons-computed']")) {
      clearInterval(jsInitChecktimer);
      await getData(chromeVar, "add-numLikes");
      const numLikes = await getData(chromeVar, 'get-numLikes');
      fnAddButtons(doc, numLikes + " like", "like-btn", "div[id='top-level-buttons-computed']");
      fnDefineEvents("like-btn", "add-numLikes", doc, chromeVar);
      const numDislikes = await getData(chromeVar, 'get-numDislikes');
      fnAddButtons(doc, numDislikes + " dislike", "dislike-btn", "div[id='top-level-buttons-computed']");
      fnDefineEvents("dislike-btn", "add-numDislikes", doc, chromeVar);
      const numMisinformation = await getData(chromeVar, 'get-numMisinformation');
      fnAddButtons(doc, numMisinformation + " Misinformation", "Misinformation-flag-btn", "div[id='info-contents']");
      const numDidNotWork = await getData(chromeVar, 'get-numDidNotWork');
      fnAddButtons(doc, numDidNotWork + " Didn't Work", "Didn't-work-flag-btn", "div[id='info-contents']");
      const numOutdated = await getData(chromeVar, 'get-numOutdated');
      fnAddButtons(doc, numOutdated + " Outdated", "Outdated-flag-btn", "div[id='info-contents']");
      const numOffensive = await getData(chromeVar, 'get-numOffensive');
      fnAddButtons(doc, numOffensive + " Offensive", "Offensive-flag-btn", "div[id='info-contents']");
      const numImmoral = await getData(chromeVar, 'get-numImmoral');
      fnAddButtons(doc, numImmoral + " Immoral", "Immoral-flag-btn", "div[id='info-contents']");

      addTextNode(doc, numLikes + " Likes ", "div[id='info-contents']");
      addTextNode(doc, numDislikes + " Disikes", "div[id='info-contents']");
    }
  }
}

try{
  // @ts-ignore
  main(document, chrome);
} catch(e) {
  console.log(e);
}

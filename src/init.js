function fnAddButtons(doc, value, id, inputLocation, color) {
  var btn = doc.createElement("input");
  btn.value = value;
  btn.id = id;
  btn.type = "submit";
  btn.style.background = color;
  btn.disabled = true;
  doc.querySelector(inputLocation).appendChild(btn);
  return btn;
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

function fnDefineEvents(id, msg, doc, chromeVar, dataType, buttonText) {
  doc
    .getElementById(id)
    .addEventListener("click", function (event) {
      sendValueFromID(chromeVar, doc, "username-textedit");
      chromeVar.runtime.sendMessage({msg: msg}, (response) => {
        if (!response) {
          console.log("not recieved");
        }else {
          console.log(response.data);
          updateButtonText(chromeVar, doc, id, dataType, buttonText);
        }
      })
    });
}

async function updateButtonText(chromeVar, doc, id, dataType, buttonText) {
  const currentURL = await getData(chromeVar, 'URL');
  const ratingData = await getData(chromeVar, 'get-' + currentURL.URL);
  doc.getElementById(id).value = ratingData[dataType] + buttonText;
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

function constructButton(doc, ratioData, name, id, inputLocation, msg, chromeVar, dataType, buttonText) {
  let color = "grey";
  let ratioSTR = ratioData;
  if (ratioData >= 0){
    if (id !== "like-btn") {
      color = "red";
    }else{
      color = "green";
    }
    ratioSTR = " +" + ratioData.toString();
  }else if (ratioData < 0) {
    if (id !== "like-btn") {
      color = "green";
    }else{
      color = "red";
    }
    ratioSTR = " " + ratioData.toString();
  }
  let btn = fnAddButtons(doc, name + ratioSTR, id, inputLocation, color);
  fnDefineEvents(id, msg, doc, chromeVar, dataType, buttonText);
  return btn;
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
    let sanitizedYTLikes = numYTLikes.replace(" likes", "");
    sanitizedYTLikes = parseInt(sanitizedYTLikes.replace(",", ""));
    return sanitizedYTLikes * (extDislikes/extLikes);
  }
}

function enableButtons(buttons) {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = false;
  }
}

function convertYTTimeStampToMiliSeconds(timeString) {
  const videoLen = timeString.split(":");
  let videoLenMS = 0;
  for (let i = videoLen.length - 1; i > -1; i--) {
    if ((videoLen.length - i) == 1) {
      videoLenMS += parseInt(videoLen[i]) * (1000);
    } else if ((videoLen.length - i) == 2) {
      videoLenMS += parseInt(videoLen[i]) * (60000);
    }
  }
  return videoLenMS;
}

function convertYTURLtoYTUID(window) {
  let fullURL = window.location.toString()
  let ytID = fullURL.replace('https://www.youtube.com/watch?v=', '');
  return ytID;
}

function main(doc, chromeVar, window) {
  var jsInitChecktimer = setInterval(checkForJS_Finish, 111);

  async function checkForJS_Finish () {
    if (doc.querySelector("div[id='top-level-buttons-computed']")) {
      clearInterval(jsInitChecktimer);
      const currentURL = await convertYTURLtoYTUID(window);
      await getData(chromeVar, 'URL-' + currentURL);
      const ratingData = await getData(chromeVar, 'get-' + currentURL);
      const ratioData = await getData(chromeVar, 'getRatioDiff-' + currentURL);
      const rankData = await getData(chromeVar, 'getRankingData-' + currentURL)
      var el = doc.querySelector("span[class='ytp-time-duration']");
      console.log(el.innerText);
      const waitTime = convertYTTimeStampToMiliSeconds(el.innerText);
      const buttons = [];
      buttons.push(constructButton(doc, ratioData.is_liked, ratingData.is_liked + " like", "like-btn", "div[id='top-level-buttons-computed']", "add-is_liked", chromeVar, "is_liked", " Like +" + ratioData.is_liked));
      buttons.push(constructButton(doc, ratioData.is_disliked, ratingData.is_disliked + " dislike", "dislike-btn", "div[id='top-level-buttons-computed']", "add-is_disliked", chromeVar, "is_disliked", " Dislike"));
      buttons.push(constructButton(doc, ratioData.is_misinformation, ratingData.is_misinformation + " Misinformation", "Misinformation-flag-btn", "div[id='info-contents']", "add-is_misinformation", chromeVar, "is_misinformation", " misinformation"));
      buttons.push(constructButton(doc, ratioData.is_did_not_work, ratingData.is_did_not_work + " Didn't Work", "Didn't-work-flag-btn", "div[id='info-contents']", "add-is_did_not_work", chromeVar, "is_did_not_work", " Didn't Work"));
      buttons.push(constructButton(doc, ratioData.is_outdated, ratingData.is_outdated + " Outdated", "Outdated-flag-btn",  "div[id='info-contents']", "add-is_outdated", chromeVar, "is_outdated", " Outdated"));
      buttons.push(constructButton(doc, ratioData.is_offensive, ratingData.is_offensive + " Offensive", "Offensive-flag-btn",  "div[id='info-contents']", "add-is_offensive", chromeVar, "is_offensive", " Offensive"));
      buttons.push(constructButton(doc, ratioData.is_immoral, ratingData.is_immoral + " Immoral", "Immoral-flag-btn", "div[id='info-contents']", "add-immoral", chromeVar, "is_immoral", " Immoral"));
      addTextNode(doc, "username: ", "div[id='info-contents']");
      addTextEdit(doc, "username-textedit", "div[id='info-contents']");
      addTextNode(doc, "password: ", "div[id='info-contents']");
      addTextEdit(doc, "password-textedit", "div[id='info-contents']");
      addTextNode(doc, calculateEstimatedDislikes(getNumYTLikes(doc), ratingData.is_liked, ratingData.is_disliked) + " Estimated Dislikes ", "div[id='info-contents']");
      addTextNode(doc, rankData.ranking + " Video Ranking", "div[id='info-contents']")
      await new Promise(r => setTimeout(r, waitTime * 0.5)).then(() => {
        enableButtons(buttons);
      });
    }
  }
}


try{
  var body = document.getElementsByTagName("body")[0];
  body.addEventListener("yt-navigate-finish", function(event) {
    main(document, chrome, window);
  });
} catch (e) {
  console.log(e);
}

// credit: https://github.com/1c7/Youtube-Auto-Subtitle-Download/blob/master/Youtube%20%E4%B8%8B%E8%BD%BD%E8%87%AA%E5%8A%A8%E5%AD%97%E5%B9%95%E7%9A%84%E5%AD%97%E8%AF%8D%E7%BA%A7%E6%96%87%E4%BB%B6/Tampermonkey.js

export  { fnDefineEvents, fnAddButtons, addTextNode, getData, addTextEdit, constructButton, sendValueFromID, calculateEstimatedDislikes, getNumYTLikes, updateButtonText, convertYTTimeStampToMiliSeconds, enableButtons, convertYTURLtoYTUID };

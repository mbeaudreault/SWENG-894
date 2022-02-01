function fnAddButtons(doc, value, id) {
  var btn = doc.createElement("input");
  btn.value = value;
  btn.id = id;
  btn.type = "submit";
  doc.querySelector("div[id='top-level-buttons-computed']").appendChild(btn);
}

function fnDefineEvents(doc, chromeVar) {
  doc
    .getElementById("like-btn")
    .addEventListener("click", function (event) {
      chromeVar.runtime.sendMessage({msg: "user-liked"}, (response) => {
        if (!response) {
          console.log("not recieved");
        }else {
          console.log("received");
        }
      })
    });

    doc
      .getElementById("dislike-btn")
      .addEventListener("click", function (event) {
        chromeVar.runtime.sendMessage({msg: "user-disliked"}, (response) => {
          if (response) {
            console.log("received");
          } else {
            console.log("not received ")
          }
        })
      });
}

function main(doc, chromeVar) {
  var jsInitChecktimer = setInterval(checkForJS_Finish, 111);

  function checkForJS_Finish () {
    if (doc.querySelector("div[id='top-level-buttons-computed']")) {
      clearInterval(jsInitChecktimer);
      fnAddButtons(doc, "like", "like-btn");
      fnAddButtons(doc, "dislike", "dislike-btn");
      fnDefineEvents(doc, chromeVar);
    }
  }
}

try{
  // @ts-ignore
  main(document, chrome);
} catch(e) {
}

export { fnDefineEvents, fnAddButtons };

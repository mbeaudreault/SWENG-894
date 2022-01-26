function fnAddButtons(value, id) {
  var btn = document.createElement("input");
  btn.value = value;
  btn.id = id;
  btn.type = "submit";
  document.querySelector("div[id='top-level-buttons-computed']").appendChild(btn);
}

function fnDefineEvents(rating) {
  document
    .getElementById("like-btn")
    .addEventListener("click", function (event) {
      chrome.runtime.sendMessage({msg: "user-liked"}, (response) => {
        if (!response) {
          console.log("not recieved");
        }else {
          console.log("received");
        }
      })
    });

    document
      .getElementById("dislike-btn")
      .addEventListener("click", function (event) {
        chrome.runtime.sendMessage({msg: "user-disliked"}, (response) => {
          if (response) {
            console.log("received");
          } else {
            console.log("not received ")
          }
        })
      });
}

function main() {
  var jsInitChecktimer = setInterval(checkForJS_Finish, 111);

  function checkForJS_Finish () {
    if (document.querySelector("div[id='top-level-buttons-computed']")) {
      clearInterval(jsInitChecktimer);
      fnAddButtons("like", "like-btn");
      fnAddButtons("dislike", "dislike-btn");
      fnDefineEvents();
    }
  }
}

main();

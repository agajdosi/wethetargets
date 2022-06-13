let portFromContentScript;
let portFromPopup;

let googleQuestions = [];
let googleReadyForTest = false;

function connected(port) {
  if (port.name == "portFromContentScript"){
    portFromContentScript = port;

    portFromContentScript.onMessage.addListener(function(m) {
      if (m.message == "google") {
        let question = googleQuestions.pop()
        if (question == undefined) {
          return
        }
        portFromContentScript.postMessage({question: question});
        //chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        //  chrome.tabs.reload(tabs[0].id);
        //});
      }
      portFromContentScript.postMessage({greeting: "In background script, received message from content script:" + m.greeting});
    });
  }

  if (port.name == "portFromPopup"){
    portFromPopup = port;
    portFromPopup.onMessage.addListener(handlePopupMessage);
  }

}




function handlePopupMessage(message){
  runGoogleTest(); //handle another options in future
}

function runGoogleTest(){
  googleQuestions = ["how to", "where to", "which"];
  console.log(googleQuestions);
}





browser.runtime.onConnect.addListener(connected);

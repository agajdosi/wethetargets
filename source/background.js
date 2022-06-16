let portFromContentScript;
let portFromPopup;

let googleQuestions = [];
let googleReadyForTest = false;

browser.runtime.onConnect.addListener(connected);

function connected(port) {
  if (port.name == "portFromContentScript"){
    portFromContentScript = port;
    portFromContentScript.onMessage.addListener(handleMessageFromContentScript);
  }
  if (port.name == "portFromPopup"){
    portFromPopup = port;
    portFromPopup.onMessage.addListener(handleMessageFromPopup);
  }
}


function handleMessageFromContentScript(message){
  if (message.page == "google") {
    let question = googleQuestions.pop()
    if (question == undefined) {
      return
    }
    portFromContentScript.postMessage({question: question});
  }

  portFromContentScript.postMessage({greeting: "In background script, received message from content script:" + m.greeting});
}

function handleMessageFromPopup(message){
  runGoogleTest(); //handle another options in future
}


function runGoogleTest(){
  googleQuestions = ["how to", "where to", "which"];
  console.log(googleQuestions);
}



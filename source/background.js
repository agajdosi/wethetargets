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
  if (message.page == "google") handleMessageFromGoogle(message);
}

function handleMessageFromGoogle(message){
  if (message.type == "results") {
    console.log(message.results)
    return
  }
  
  if (message.type == "started") {
    let question = googleQuestions.pop()
    if (question == undefined) {
      return
    }
    portFromContentScript.postMessage({question: question});
  }
}

function handleMessageFromPopup(message){
  runGoogleTest(); //handle another options in future
}


function runGoogleTest(){
  googleQuestions = ["how to", "where to", "which"];
  browser.tabs.update({url: "https://google.com"})
}

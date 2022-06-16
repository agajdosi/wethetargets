let portFromContentScript;
let myPort = browser.runtime.connect({name:"portFromPopup"});

document.getElementById("googleButton").addEventListener("click", startGoogleTest);

function startGoogleTest(){
    myPort.postMessage({command: "start the google test"});
}


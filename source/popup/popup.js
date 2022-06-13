let portFromContentScript;
let myPort = browser.runtime.connect({name:"portFromPopup"});

document.getElementById("googleButton").addEventListener("click", startGoogleTest); 

function startGoogleTest(){
    console.log("log from popup")
    myPort.postMessage({greeting: "start the google test"});
}


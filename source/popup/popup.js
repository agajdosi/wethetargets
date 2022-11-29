/** Starting point for all code running from the popup window. */
let myPort = browser.runtime.connect({name:"portFromPopup"});

document.getElementById("googleButton").addEventListener("click", startGoogleTest);


/** Start result mining on Google search. */
function startGoogleTest(){
    myPort.postMessage({command: "start the google test"});
}


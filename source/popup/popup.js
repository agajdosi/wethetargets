// Starting point for all code running from the popup window.
let myPort = browser.runtime.connect({name:"portFromPopup"});

window.addEventListener("load", onPopupLoad);
document.getElementById("googleButton").addEventListener("click", startGoogleTest);
document.getElementById("saveDemographics").addEventListener("click", saveDemographics);

// Start result mining on Google search.
function startGoogleTest(){
    myPort.postMessage({command: "start the google test"});
}


function saveDemographics(e){
    e.preventDefault();
    const gender = document.getElementById("gender").value;
    const country = document.getElementById("country").value;
    const born = document.getElementById("born").value;
    const email = document.getElementById("email").value;
    browser.storage.sync.set({
        gender: gender,
        country: country,
        born: born,
        email: email,
    });
    console.log("Saved demographics");
}


async function onPopupLoad(e){
    const stored = await browser.storage.sync.get();
    if (stored["gender"]) document.getElementById("gender").value = stored["gender"];
    if (stored["country"]) document.getElementById("country").value = stored["country"];
    if (stored["born"]) document.getElementById("born").value = stored["born"];
    if (stored["email"]) document.getElementById("email").value = stored["email"];
}

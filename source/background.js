let portFromContentScript;
let portFromPopup;

const APP_ID = 77
const SERVER = "http://localhost:8888"
let questions = [];
let results = [];

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
    results.push([message.question, message.results])
    uploadGoogleResults(message.question, message.results)
    return
  }
  
  if (message.type == "started") {
    let question = questions.pop()
    if (question == undefined) {
      console.log(results)
      return
    }
    portFromContentScript.postMessage({"question": question});
  }
}

function handleMessageFromPopup(message){
  if (message.command == "start the google test") runGoogleTest();
}

function runGoogleTest(){
  results = [];
  //questions = ["how to", "where to", "which"];
  questions = questions.concat(neutralQuestions)
  
  let qs = [];
  for (let i=0; i < genderedThings.length; i++) {
    for (let x=0; x < genderedQuestions.length; x++) {
        qs.push(genderedQuestions[x] + " female " + genderedThings[i])
    }
  }
  questions = questions.concat(qs)

  console.log(questions)

  browser.tabs.update({url: "https://google.com"})
}

function uploadGoogleResults(question, results){
  let api_endpoint = SERVER + "/browser-plugin"
  let data = {
    "app_id": APP_ID,
    "person_info": null,
    "question": question,
    "answers": results,
  }
  fetch(api_endpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

let genderedQuestions = [
  "what",
  "which",
  "where",
  "how",
  "when"
]

let stuff = [
  "good",
  "nice",
  "fine",
  "cool",
  "awesome",
  "best"
]

let genderedThings = [
  "boots",
  "books",
  "music",
  "hats",
  "films",
  "series",
  "jobs",
  "sport",
  "shirts",
  "trousers",
  "glasses",
  "tips",
  "jokes",
  "pants",
  "T-shirts",
  "fashion",
  "trends",
  "food"
]


let neutralQuestions = [
  "where to go",
  "what to do with",
  "which job",
  "career tips",
  "how to relax",
  "how to please",
  "how to be good",
  "what is meaning of life",
  "how to be",
  "which film",
  "which book",
  "recommended music",
  "best places for",
  "am I",
  "where",
  "what",
  "which",
  "how",
  "who",
  "should I",
  "is it"
]



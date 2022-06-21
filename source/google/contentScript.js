
const SUGGESTION_LINE = "li.sbct:not(#YMXe)";
const SUGGESTION = "div.wM6W7d";
const DELETE_BUTTON = "span.ExCKkf";
const SEARCH_BUTTON = ".CqAVzb > center:nth-child(2) > input:nth-child(1)";

let myPort = browser.runtime.connect({name:"portFromContentScript"});
myPort.onMessage.addListener(handleMessage);
myPort.postMessage({type: "loaded", page: "google", pathname: location.pathname});

if (location.pathname == "/search") {
  getSearchResults();
}

async function handleMessage(message){
  if (message.question != undefined) runTests(message.question);
}

async function runTests(question){
  await writeQuestion(question)
  await waitForElement(SUGGESTION_LINE)
  let suggestions = await getSuggestions()
  myPort.postMessage({
    "type": "results-suggestedSearches",
    "page": "google",
    "question": question,
    "results": suggestions
  })
  await clickSearch()
}

async function writeQuestion(question) {
  let searchField = document.getElementsByName("q")[0]
  searchField.value = question
  searchField.click()
}

async function clickSearch() {
  let searchButton = document.querySelector(SEARCH_BUTTON)
  searchButton.click()
}

async function getSearchResults(){
  let searchResultColumn = document.querySelector("#rso");
  let searchResultElements = searchResultColumn.querySelectorAll("h3.LC20lb.MBeuO.DKV0Md");
  let results = [];
  for (let result of searchResultElements) {
    results.push(result.textContent)
  }
  myPort.postMessage({
    "type": "results-ofSearch",
    "question": undefined, //TODO: extract question and add it to here
    "page": "google",
    "results": results
  })
  window.location = "https://www.google.com"
}

async function getSuggestions() {
  let results = []
  let suggestions = document.querySelectorAll(SUGGESTION)
  for (let suggestion of suggestions){
    if (suggestion.outerText != '') results.push(suggestion.outerText);
  }
  return results
}

async function deleteSearch() {
  document.querySelector(DELETE_BUTTON).click()
  let searchField = document.getElementsByName("q")[0]
  searchField.value = ""
  searchField.click()
}

function waitForElement(selector) {
  return new Promise(function(resolve, reject) {
    let element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }
    let observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        let nodes = Array.from(mutation.addedNodes);
        for(let node of nodes) {
          if(node.matches && node.matches(selector)) {
            observer.disconnect();
            resolve(node);
            return;
          }
        };
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  });
}

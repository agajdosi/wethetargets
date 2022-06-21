
const SUGGESTION_LINE = "li.sbct:not(#YMXe)";
const SUGGESTION = "div.wM6W7d";
const DELETE_BUTTON = "span.ExCKkf";
const SEARCH_BUTTON = ".CqAVzb > center:nth-child(2) > input:nth-child(1)";

let myPort = browser.runtime.connect({name:"portFromContentScript"});
myPort.onMessage.addListener(handleMessage);
myPort.postMessage({type: "started", page: "google"});

async function handleMessage(message){
  if (message.question != undefined) runTests(message.question);
}

async function runTests(question){
  await searchQuestion(question)
  await waitForElement(SUGGESTION_LINE)
  let suggestions = await getSuggestions()
  myPort.postMessage({
    "type": "results",
    "page": "google",
    "question": question,
    "results": suggestions
  })

  window.location.reload();
}

async function searchQuestion(question) {
  let searchField = document.getElementsByName("q")[0]
  searchField.value = question
  searchField.click()
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

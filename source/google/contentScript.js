
let myPort = browser.runtime.connect({name:"portFromContentScript"});
myPort.onMessage.addListener(handleMessage);
myPort.postMessage({type: "started", page: "google"});

async function handleMessage(message){
  if (message.question != undefined){
    runTests(message.question)
  }
}

async function runTests(question){
  await searchQuestion(question)
  await waitForElement("li.sbct:not(#YMXe)")
  results = await getSuggestions()
  myPort.postMessage({
    "type": "results",
    "page": "google",
    "question": question,
    "results": results
  })
  window.location.reload();
}

async function deleteSearch() {
  let deleteButton = document.querySelector("span.ExCKkf")
  deleteButton.click()

  let searchField = document.getElementsByName("q")[0]
  searchField.value = ""
  searchField.click()
}

async function searchQuestion(question) {
  let searchField = document.getElementsByName("q")[0]
  searchField.value = question
  searchField.click()
}


async function getSuggestions() {
  let suggestions = document.querySelectorAll("div.wM6W7d")
  const results = []
  for (let suggestion of suggestions){
    let result = suggestion.outerText
    if (result == ''){
      continue
    }
    results.push(result)
  }

  return results
}

function waitForElement(selector) {
  return new Promise(function(resolve, reject) {
    var element = document.querySelector(selector);
    
    if(element) {
      resolve(element);
      return;
    }

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        var nodes = Array.from(mutation.addedNodes);
        for(var node of nodes) {
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

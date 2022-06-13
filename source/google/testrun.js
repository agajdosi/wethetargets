
//searchQuestion("how to")
//let results = waitForElement("li.sbct:not(#YMXe)").then(getSuggestions);

runTests()


async function runTests(){
  await searchQuestion("how to")
  await waitForElement("li.sbct:not(#YMXe)")
  results = await getSuggestions()
  console.log(results)


  await searchQuestion("where to")
  await waitForElement("li.sbct:not(#YMXe)")
  results = await getSuggestions()
  console.log(results)


  await searchQuestion("which")
  await waitForElement("li.sbct:not(#YMXe)")
  results = await getSuggestions()
  console.log(results)
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
    console.log(result)
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




console.log("Content script ended")

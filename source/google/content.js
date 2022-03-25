

searchQuestion("how to please")
waitForElement("li.sbct:not(#YMXe)").then(getSuggestions);








function getSuggestions() {
  let suggestions = document.querySelectorAll("div.wM6W7d")
  for (let suggestion of suggestions){
    console.log(suggestion.outerText)
  }
}


function searchQuestion(question) {
  let searchField = document.getElementsByName("q")[0]
  searchField.value = question
  searchField.click()
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

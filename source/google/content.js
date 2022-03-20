console.log("Content script started")

let searchField = document.getElementsByName("q")[0]


searchField.value = "what should";
searchField.click()

document.querySelector(".aajZCb").onload = function() {
  let suggestions = document.getElementsByClassName("wM6W7d")
  for (let suggestion of suggestions){
    console.log(suggestion)
  }
}





console.log("Content script ended")

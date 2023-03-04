
// PRE-SEARCH
const SUGGESTION_LINE = 'li.sbct:not(#YMXe):not(#mitGyb)';
const SUGGESTION = 'div.wM6W7d';
// Const DELETE_BUTTON = 'span.ExCKkf';

// POST-SEARCH
const SEARCHED_QUESTION = 'input.gLFyf[name="q"]';

const myPort = browser.runtime.connect({name: 'portFromContentScript'});
myPort.onMessage.addListener(handleMessage);
myPort.postMessage({type: 'loaded', page: 'google', pathname: location.pathname});

if (location.pathname === '/search') {
	getSearchResults();
}

async function handleMessage(message) {
	if (message.question !== undefined) {
		runTests(message.question);
	}
}

async function runTests(question) {
	await writeQuestion(question);
	await waitForElement(SUGGESTION_LINE);
	const suggestions = await getSuggestions();
	myPort.postMessage({
		type: 'results-suggestedSearches',
		page: 'google',
		question,
		results: suggestions,
	});
	await clickSearch();
}

async function writeQuestion(question) {
	const searchField = document.getElementsByName('q')[0];
	searchField.value = question;
	searchField.click();
}

async function clickSearch() {
	const searchButton = document.getElementsByName('btnK')[0];
	searchButton.click();
}

// POST-SEARCH
async function getSearchResults() {
	const inputField = document.querySelector(SEARCHED_QUESTION);
	const searchedQuestion = inputField.value;
	const searchResultColumn = document.querySelector('#rso');
	const searchResultElements = searchResultColumn.querySelectorAll('h3.LC20lb.MBeuO.DKV0Md');
	const results = [];
	for (const result of searchResultElements) {
		results.push(result.textContent);
	}
	// TODO: do not report with zero results or empty question

	myPort.postMessage({
		type: 'results-ofSearch',
		question: searchedQuestion,
		page: 'google',
		results,
	});
	window.location = 'https://www.google.com';
}

async function getSuggestions() {
	const results = [];
	const suggestions = document.querySelectorAll(SUGGESTION);
	for (const suggestion of suggestions) {
		if (suggestion.outerText !== '') {
			results.push(suggestion.outerText);
		}
	}

	return results;
}

function waitForElement(selector) {
	return new Promise(resolve => {
		const element = document.querySelector(selector);
		if (element) {
			resolve(element);
			return;
		}

		const observer = new MutationObserver(mutations => {
			for (const mutation of mutations) {
				const nodes = Array.from(mutation.addedNodes);
				for (const node of nodes) {
					if (node.matches && node.matches(selector)) {
						observer.disconnect();
						resolve(node);
						return;
					}
				}
			}
		});
		observer.observe(document.documentElement, {childList: true, subtree: true});
	});
}

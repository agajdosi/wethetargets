let portFromContentScript;
let portFromPopup;

const EXTENSION_VERSION = '0.0.2';
const SERVER = 'https://artops.gajdosik.org/wethetargets';
let questions = [];
let results = [];

const DEMOGRAPHICS = {born: 1992, sex: 'male', country: 'CZ'} // TODO: get actual data from popup

// CONNECTION to popup scripts and content scripts
browser.runtime.onConnect.addListener(connected);
function connected(port) {
	if (port.name === 'portFromContentScript') {
		portFromContentScript = port;
		portFromContentScript.onMessage.addListener(handleMessageFromContentScript);
	}

	if (port.name === 'portFromPopup') {
		portFromPopup = port;
		portFromPopup.onMessage.addListener(handleMessageFromPopup);
	}
}

// POPUP communication
function handleMessageFromPopup(message) {
	if (message.command === 'start the google test') {
		runGoogleTest();
	}
}

function runGoogleTest() {
	results = [];
	questions = getSearchQuestions();
	browser.tabs.update({url: 'https://www.google.com'});
}

// CONTENT SCRIPT communication
function handleMessageFromContentScript(message) {
	if (message.page === 'google') {
		handleMessageFromGoogle(message);
	}
}

// GOOGLE CONTENT
function handleMessageFromGoogle(message) {
	if (message.type === 'results-suggestedSearches') {
		console.log('results-suggestedSearches:', message.results);
		results.push([message.question, message.results]);
		uploadGoogleSuggestions(message.question, message.results);
		return;
	}

	if (message.type === 'results-ofSearch') {
		console.log('results-ofSearch:', message.results);
		uploadGoogleSearchResults(message.question, message.results);
		return;
	}

	// Page loaded
	if (message.type === 'loaded') {
		if (message.pathname === '/search') {
			return;
		}

		// Google home page was loaded
		if (message.pathname === '/') {
			const question = questions.pop();
			if (question === undefined) {
				console.log(results);
				return;
			}
			portFromContentScript.postMessage({question});
			return;
		}
	}
}

//GOOGLE DATA UPLOAD
//Upload Google suggestions
async function uploadGoogleSuggestions(question, suggestions) {
	const apiEndpoint = SERVER + '/ggl-suggestions';
	const data = {
		extensionVersion: EXTENSION_VERSION,
		demographics: DEMOGRAPHICS,
		question,
		suggestions,
	};
	const options = {
		method: 'POST',
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};
	const response = await fetch(apiEndpoint, options);
	const results = await response.json();
	console.log('uploadGoogleSuggestions results:', results);
}

//Upload Google search results
async function uploadGoogleSearchResults(question, searches) {
	const apiEndpoint = SERVER + '/ggl-searches';
	const data = {
		extensionVersion: EXTENSION_VERSION,
		demographics: DEMOGRAPHICS,
		question,
		searches,
	};
	const options = {
		method: 'POST',
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};
	const response = await fetch(apiEndpoint, options);
	const results = await response.json();
	console.log('uploadGoogleSearches results:', results);
}

//GET DATA TO UPLOAD
function getSearchQuestions() {
	const researchQuestions = [
		'where to go',
		'what to do with',
		'which job',
		'career tips',
		'how to relax',
		'how to please',
		'how to be good',
		'what is meaning of life',
		'how to be',
		'which film',
		'which book',
		'recommended music',
		'best places for',
		'am I',
		'where',
		'what',
		'which',
		'how',
		'who',
		'should I',
		'is it',
	];
	return researchQuestions;
}


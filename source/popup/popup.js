// Starting point for all code running from the popup window.
const myPort = browser.runtime.connect({name: 'portFromPopup'});

window.addEventListener('load', onPopupLoad);
document.querySelector('#googleButton').addEventListener('click', startGoogleTest);
document.querySelector('#saveDemographics').addEventListener('click', saveDemographics);

// Start result mining on Google search.
function startGoogleTest() {
	myPort.postMessage({command: 'start the google test'});
}

function saveDemographics(e) {
	e.preventDefault();
	const gender = document.querySelector('#gender').value;
	const country = document.querySelector('#country').value;
	const born = document.querySelector('#born').value;
	const education = document.querySelector('#education').value;
	const profession = document.querySelector('#profession').value;
	const interests = document.querySelector('#interests').value;
	const email = document.querySelector('#email').value;
	browser.storage.sync.set({
		gender,
		country,
		born,
		education,
		profession,
		interests,
		email,
	});
	console.log('Saved demographics');
}

async function onPopupLoad(e) {
	const stored = await browser.storage.sync.get();
	if (stored.gender) {
		document.querySelector('#gender').value = stored.gender;
	}

	if (stored.country) {
		document.querySelector('#country').value = stored.country;
	}

	if (stored.born) {
		document.querySelector('#born').value = stored.born;
	}

	if (stored.education) {
		document.querySelector('#education').value = stored.education;
	}

	if (stored.profession) {
		document.querySelector('#profession').value = stored.profession;
	}

	if (stored.interests) {
		document.querySelector('#interests').value = stored.interests;
	}

	if (stored.email) {
		document.querySelector('#email').value = stored.email;
	}
}

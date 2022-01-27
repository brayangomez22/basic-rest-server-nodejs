const myForm = document.querySelector('form');

const url = window.location.hostname.includes('localhost') ? 'http://localhost:8080/api/auth/' : 'https://rest-server-app-nodejs.herokuapp.com/api/auth/';

myForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const formData = {};

	for (let element of myForm.elements) {
		if (element.name.length > 0) {
			formData[element.name] = element.value;
		}
	}

	fetch(url + 'login', {
		method: 'POST',
		body: JSON.stringify(formData),
		headers: { 'Content-Type': 'application/json' },
	})
		.then((resp) => resp.json())
		.then(({ msg, ok, token }) => {
			if (!ok) {
				return console.log(msg);
			}

			localStorage.setItem('token', token);
			window.location = 'chat.html';
		})
		.catch((err) => console.log(err));
});

function handleCredentialResponse(response) {
	const body = { id_token: response.credential };

	fetch(url + 'google', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})
		.then((resp) => resp.json())
		.then((resp) => {
			localStorage.setItem('email', resp.user.email);
			localStorage.setItem('token', resp.token);
			window.location = 'chat.html';
		})
		.catch((err) => console.warn(err));
}

const button = document.getElementById('google_signout');
button.onclick = () => {
	google.accounts.id.disableAutoSelect();

	google.accounts.id.revoke(localStorage.getItem('email'), (done) => {
		localStorage.clear();
		location.reload();
	});
};

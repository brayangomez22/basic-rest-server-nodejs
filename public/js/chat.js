const url = window.location.hostname.includes('localhost') ? 'http://localhost:8080/api/auth/' : 'https://rest-server-app-nodejs.herokuapp.com/api/auth/';
let user = null;
let socketServer = null;

const txtUID = document.getElementById('txtUID');
const txtMessage = document.getElementById('txtMessage');
const listUsers = document.getElementById('listUsers');
const chat = document.getElementById('chat');
const btnLeave = document.getElementById('btnLeave');

const validateJWT = async () => {
	const token = localStorage.getItem('token');

	if (token.length <= 10) {
		window.location = 'index.html';
		throw new Error('No token on server');
	}

	const resp = await fetch(url, {
		headers: { 'x-token': token },
	});

	const { user: userDB, token: tokenDB } = await resp.json();
	localStorage.setItem('token', tokenDB);
	user = userDB;

	document.title = user.name;

	await connectSocket();
};

const connectSocket = async () => {
	socketServer = io({
		extraHeaders: {
			'x-token': localStorage.getItem('token'),
		},
	});

	socketServer.on('connect', () => {
		console.log('online');
	});

	socketServer.on('disconnect', () => {
		console.log('offline');
	});

	socketServer.on('receive-messages', showMessages);

	socketServer.on('active-users', showUsers);

	socketServer.on('private-message', (payload) => {
		console.log(payload);
	});
};

const showMessages = (messages = []) => {
	let messagesHTML = '';
	messages.forEach(({ name, message }) => {
		messagesHTML += `
			<li>
				<p>
					<span class="text-primary">${name}: </span>
					<span>${message}</span>
				</p>
			</li>
		`;
	});

	chat.innerHTML = messagesHTML;
};

const showUsers = (users = []) => {
	let usersHTML = '';
	users.forEach(({ name, uid }) => {
		usersHTML += `
			<li>
				<p>
					<h5 class="text-success">${name}</h5>
					<span class="fs-6 text-muted">${uid}</span>
				</p>
			</li>
		`;
	});

	listUsers.innerHTML = usersHTML;
};

txtMessage.addEventListener('keyup', ({ keyCode }) => {
	const message = txtMessage.value;
	const uid = txtUID.value;

	if (keyCode !== 13) {
		return;
	}
	if (message.length === 0) {
		return;
	}

	socketServer.emit('send-message', { message, uid });
	txtMessage.value = '';
});

const main = async () => {
	await validateJWT();
};

main();

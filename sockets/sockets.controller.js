const { checkJWT } = require('../helpers');
const { ChatMessages } = require('../models');

const chatMessages = new ChatMessages();

const socketsController = async (socket, io) => {
	try {
		const token = socket.handshake.headers['x-token'];
		const user = await checkJWT(token);

		if (!user) {
			return socket.disconnect();
		}

		chatMessages.connectUser(user);
		io.emit('active-users', chatMessages.usersArr);
		socket.emit('receive-messages', chatMessages.lastTen);

		socket.join(user.id);

		socket.on('disconnect', () => {
			chatMessages.disconnectUser(user.id);
			io.emit('active-users', chatMessages.usersArr);
		});

		socket.on('send-message', ({ message, uid }) => {
			if (uid) {
				socket.to(uid).emit('private-message', { from: user.name, message });
			} else {
				chatMessages.sendMessage(user.id, user.name, message);
				io.emit('receive-messages', chatMessages.lastTen);
			}
		});
	} catch (error) {
		return error;
	}
};

module.exports = {
	socketsController,
};

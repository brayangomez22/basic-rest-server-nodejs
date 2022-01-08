const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.authPath = '/api/auth';
		this.usersPath = '/api/users';

		this.connectDB();
		this.middlewares();
		this.routes();
	}

	async connectDB() {
		await dbConnection();
	}

	middlewares() {
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.static('public'));
	}

	routes() {
		this.app.use(this.authPath, require('../routes/auth.routes'));
		this.app.use(this.usersPath, require('../routes/users.routes'));
	}

	listen() {
		this.app.listen(this.port, () => console.log(`Server running on the port ${this.port}`));
	}
}

module.exports = Server;

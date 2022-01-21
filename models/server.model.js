const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { dbConnection } = require('../database/config');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.paths = {
			auth: '/api/auth',
			users: '/api/users',
			categories: '/api/categories',
			products: '/api/products',
			searches: '/api/searches',
		};

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
		this.app.use(morgan('dev'));
		this.app.use(express.static('public'));
	}

	routes() {
		this.app.use(this.paths.auth, require('../routes/auth.routes'));
		this.app.use(this.paths.users, require('../routes/users.routes'));
		this.app.use(this.paths.categories, require('../routes/categories.routes'));
		this.app.use(this.paths.products, require('../routes/products.routes'));
		this.app.use(this.paths.searches, require('../routes/searches.routes'));
	}

	listen() {
		this.app.listen(this.port, () => console.log(`Server running on the port ${this.port}`));
	}
}

module.exports = Server;

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');

const { dbConnection } = require('../database/config');
const { socketsController } = require('../sockets/sockets.controller');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.server = createServer(this.app);
		this.io = require('socket.io')(this.server);

		this.paths = {
			auth: '/api/auth',
			users: '/api/users',
			categories: '/api/categories',
			products: '/api/products',
			searches: '/api/searches',
			uploads: '/api/uploads',
		};

		this.connectDB();
		this.middlewares();
		this.routes();
		this.sockets();
	}

	async connectDB() {
		await dbConnection();
	}

	middlewares() {
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(morgan('dev'));
		this.app.use(express.static('public'));

		this.app.use(
			fileUpload({
				useTempFiles: true,
				tempFileDir: '/tmp/',
				createParentPath: true,
			})
		);
	}

	routes() {
		this.app.use(this.paths.auth, require('../routes/auth.routes'));
		this.app.use(this.paths.users, require('../routes/users.routes'));
		this.app.use(this.paths.categories, require('../routes/categories.routes'));
		this.app.use(this.paths.products, require('../routes/products.routes'));
		this.app.use(this.paths.searches, require('../routes/searches.routes'));
		this.app.use(this.paths.uploads, require('../routes/uploads.routes'));
	}

	sockets() {
		this.io.on('connection', (socket) => socketsController(socket, this.io));
	}

	listen() {
		this.server.listen(this.port, () => console.log(`Server running on the port ${this.port}`));
	}
}

module.exports = Server;

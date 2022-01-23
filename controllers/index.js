const authController = require('./auth.controller');
const categoriesController = require('./categories.controller');
const productsController = require('./products.controller');
const searchesController = require('./searches.controller');
const uploadsController = require('./uploads.controller');
const usersController = require('./users.controller');

module.exports = {
	...authController,
	...categoriesController,
	...productsController,
	...searchesController,
	...uploadsController,
	...usersController,
};

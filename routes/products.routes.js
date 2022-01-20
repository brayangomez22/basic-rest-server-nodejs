const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, isAdminRole, hasRole } = require('../middlewares');
const { isProductExistsById, isCategorieExistsById } = require('../helpers/db-validators');

const { getProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/products.controller');

const router = Router();

router.get('/', [validateJWT], getProducts);
router.get('/:id', [validateJWT, check('id', 'Not a valid ID').isMongoId(), check('id').custom(isProductExistsById), validateFields], getProductById);

router.post(
	'/',
	[
		validateJWT,
		check('name', 'Name is required').not().isEmpty(),
		check('description', 'Description is required').not().isEmpty(),
		check('categorie', 'Categorie is required').not().isEmpty(),
		check('categorie', 'Not a valid ID categorie').isMongoId(),
		check('categorie').custom(isCategorieExistsById),
		validateFields,
	],
	addProduct
);

router.put(
	'/:id',
	[
		validateJWT,
		// check('categorie', 'Not a valid ID categorie').isMongoId(),
		// check('categorie').custom(isCategorieExistsById),
		check('id', 'Not a valid ID product').isMongoId(),
		check('id').custom(isProductExistsById),
		validateFields,
	],
	updateProduct
);

router.delete(
	'/:id',
	[
		validateJWT,
		isAdminRole,
		hasRole('ADMIN_ROLE', 'USER_ROLE', 'SALES_ROLE'),
		check('id', 'Not a valid ID').isMongoId(),
		check('id').custom(isProductExistsById),
		validateFields,
	],
	deleteProduct
);

module.exports = router;

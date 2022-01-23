const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, isAdminRole, hasRole } = require('../middlewares');
const { isCategorieExistsById } = require('../helpers');

const { getCategories, getCategorieById, addCategorie, updateCategorie, deleteCategorie } = require('../controllers');

const router = Router();

router.get('/', [validateJWT], getCategories);
router.get('/:id', [validateJWT, check('id', 'Not a valid ID').isMongoId(), check('id').custom(isCategorieExistsById), validateFields], getCategorieById);

router.post('/', [validateJWT, check('name', 'Name is required').not().isEmpty(), validateFields], addCategorie);

router.put(
	'/:id',
	[
		validateJWT,
		check('name', 'Name is required').not().isEmpty(),
		check('id', 'Not a valid ID').isMongoId(),
		check('id').custom(isCategorieExistsById),
		validateFields,
	],
	updateCategorie
);

router.delete(
	'/:id',
	[
		validateJWT,
		isAdminRole,
		hasRole('ADMIN_ROLE', 'USER_ROLE', 'SALES_ROLE'),
		check('id', 'Not a valid ID').isMongoId(),
		check('id').custom(isCategorieExistsById),
		validateFields,
	],
	deleteCategorie
);

module.exports = router;

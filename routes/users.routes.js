const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, isAdminRole, hasRole, validateFields } = require('../middlewares');

const { isValidRole, isExistingEmail, isUserExistsById } = require('../helpers/db-validators');
const { getUsers, updateUser, addUser, deleteUser } = require('../controllers/users.controller');

const router = Router();

router.get('/', getUsers);

router.put(
	'/:id',
	[check('id', 'Not a valid ID').isMongoId(), check('id').custom(isUserExistsById), check('role').custom(isValidRole), validateFields],
	updateUser
);

router.post(
	'/',
	[
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'The email is not valid').isEmail(),
		check('email').custom(isExistingEmail),
		check('password', 'The password is mandatory and must have more than 10 characters').isLength({ min: 10 }),
		check('role').custom(isValidRole),
		validateFields,
	],
	addUser
);

router.delete(
	'/:id',
	[
		validateJWT,
		isAdminRole,
		hasRole('ADMIN_ROLE', 'USER_ROLE', 'SALES_ROLE'),
		check('id', 'Not a valid ID').isMongoId(),
		check('id').custom(isUserExistsById),
		validateFields,
	],
	deleteUser
);

module.exports = router;

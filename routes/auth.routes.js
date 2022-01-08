const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');
const { loginUser } = require('../controllers/auth.controller');

const router = Router();

router.post(
	'/login',
	[
		check('email', 'The email is not valid').isEmail(),
		check('email', 'Email is required').not().isEmpty(),
		check('password', 'Password is required').not().isEmpty(),
		validateFields,
	],
	loginUser
);

module.exports = router;

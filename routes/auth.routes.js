const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateJWT } = require('../middlewares');
const { loginUser, googleSignIn, renewToken } = require('../controllers');

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

router.post('/google', [check('id_token', 'Google token is required').not().isEmpty(), validateFields], googleSignIn);

router.get('/', validateJWT, renewToken);

module.exports = router;

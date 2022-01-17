const { request, response } = require('express');
const bcrypt = require('bcrypt');

const { googleVerify } = require('../helpers/google-verify');
const { generateJWT } = require('../helpers/generate-jwt');
const User = require('../models/user.model');

const loginUser = async (req = request, res = response) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				msg: `The email or password is not correct`,
			});
		}

		if (!user.state) {
			return res.status(400).json({
				msg: `The email or password is not correct - state: false`,
			});
		}

		const validPassword = bcrypt.compareSync(password, user.password);
		if (!validPassword) {
			return res.status(400).json({
				msg: `The email or password is not correct`,
			});
		}

		const token = await generateJWT(user.id);

		res.status(200).json({
			msg: 'The login was executed successfully',
			user,
			token,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Internal Server Error',
		});
	}
};

const googleSignIn = async (req = request, res = response) => {
	try {
		const { id_token } = req.body;
		const { name, img, email } = await googleVerify(id_token);

		let user = await User.findOne({ email });
		if (!user) {
			const data = {
				name,
				email,
				password: ';p',
				img,
				google: true,
				role: 'USER_ROLE',
			};

			user = new User(data);
			await user.save();
		}

		if (!user.state) {
			res.status(401).json({
				msg: 'Talk to the administrator, the user is blocked',
			});
		}

		const token = await generateJWT(user.id);

		res.status(200).json({
			msg: 'Sign in with Google executed successfully',
			user,
			token,
		});
	} catch (error) {
		res.status(400).json({
			msg: 'The token could not be verified',
		});
	}
};

module.exports = {
	loginUser,
	googleSignIn,
};

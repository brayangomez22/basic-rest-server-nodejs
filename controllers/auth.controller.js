const { request, response } = require('express');
const bcrypt = require('bcrypt');

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

module.exports = {
	loginUser,
};

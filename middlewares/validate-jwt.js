const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

const validateJWT = async (req = request, res = response, next) => {
	const token = req.header('x-token');

	if (!token) {
		return res.status(401).json({
			msg: 'There is no token in the request',
		});
	}

	try {
		const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
		const user = await User.findById(uid);

		if (!user) {
			return res.status(401).json({
				msg: 'Invalid token - user does not exist in DB',
			});
		}

		if (!user.state) {
			return res.status(401).json({
				msg: 'Invalid token - stateful user: false',
			});
		}

		req.user = user;

		next();
	} catch (error) {
		res.status(401).json({
			msg: 'Invalid token',
		});
	}
};

module.exports = {
	validateJWT,
};

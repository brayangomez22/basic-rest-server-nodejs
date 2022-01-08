const { request, response } = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user.model');

const getUsers = async (req = request, res = response, next) => {
	try {
		const { limit = 5, from = 0 } = req.query;
		const query = { state: true };

		const [users, total] = await Promise.all([User.find(query).skip(Number(from)).limit(Number(limit)), User.countDocuments(query)]);

		res.status(200).json({
			msg: 'Users consulted successfully',
			total,
			users,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Internal Server Error',
		});
	}
};

const updateUser = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const { _id, password, google, email, ...restOfParameters } = req.body;

		if (password) {
			const salt = bcrypt.genSaltSync();
			restOfParameters.password = bcrypt.hashSync(password, salt);
		}

		const user = await User.findByIdAndUpdate(id, restOfParameters);

		res.status(200).json({
			msg: 'User updated successfully',
			user,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Internal Server Error',
		});
	}
};

const addUser = async (req = request, res = response) => {
	try {
		const { name, email, password, role } = req.body;
		const user = new User({ name, email, password, role });

		const salt = bcrypt.genSaltSync();
		user.password = bcrypt.hashSync(password, salt);

		await user.save();

		res.status(201).json({
			msg: 'User created successfully',
			user,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Internal Server Error',
		});
	}
};

const deleteUser = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const user = await User.findByIdAndUpdate(id, { state: false });

		res.status(201).json({
			msg: 'User status changed successfully',
			user,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Internal Server Error',
		});
	}
};

module.exports = {
	getUsers,
	updateUser,
	addUser,
	deleteUser,
};

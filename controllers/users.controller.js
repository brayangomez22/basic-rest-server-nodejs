const { response, request } = require('express');

const getUsers = (req = request, res = response) => {
	const query = req.query;

	res.json({
		msg: 'Get API',
		query,
	});
};

const updateUser = (req = request, res = response) => {
	const { id } = req.params;

	res.status(400).json({
		msg: 'Put API',
		id,
	});
};

const addUser = (req = request, res = response) => {
	const body = req.body;

	res.status(201).json({
		msg: 'Post API',
		body,
	});
};

const deleteUser = (req = request, res = response) => {
	res.json({
		msg: 'Delete API',
	});
};

module.exports = {
	getUsers,
	updateUser,
	addUser,
	deleteUser,
};

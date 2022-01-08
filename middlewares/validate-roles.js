const { request, response } = require('express');

const isAdminRole = (req = request, res = response, next) => {
	const user = req.user;

	if (!user) {
		return res.status(500).json({
			msg: 'Internal Server Error',
		});
	}

	const { role, name } = user;

	if (role !== 'ADMIN_ROLE') {
		return res.status(401).json({
			msg: `${name} is not an administrator, and cannot make this request`,
		});
	}

	next();
};

const hasRole = (...roles) => {
	return (req = request, res = response, next) => {
		const user = req.user;

		if (!user) {
			return res.status(500).json({
				msg: 'Internal Server Error',
			});
		}

		if (!roles.includes(user.role)) {
			return res.status(401).json({
				msg: `The service requires one of these roles: ${roles}`,
			});
		}

		next();
	};
};

module.exports = {
	isAdminRole,
	hasRole,
};

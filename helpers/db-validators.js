const Role = require('../models/role.model');
const User = require('../models/user.model');

const isValidRole = async (role) => {
	const existingRole = await Role.findOne({ role });
	if (!existingRole) {
		throw new Error(`The role: ${role}, is not registered in the database`);
	}
};

const isExistingEmail = async (email) => {
	const existingMail = await User.findOne({ email });
	if (existingMail) {
		throw new Error(`The email: ${email}, already exists`);
	}
};

const isUserExistsById = async (id) => {
	const existingUser = await User.findById(id);
	if (!existingUser) {
		throw new Error(`The ID: ${id}, does not exist in the database`);
	}
};

module.exports = {
	isValidRole,
	isExistingEmail,
	isUserExistsById,
};

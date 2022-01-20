const { Role, User, Categorie, Product } = require('../models');

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

const isCategorieExistsById = async (id) => {
	const existingCategorie = await Categorie.findById(id);
	if (!existingCategorie) {
		throw new Error(`The ID: ${id}, does not exist in the database`);
	}
};

const isProductExistsById = async (id) => {
	const existingProduct = await Product.findById(id);
	if (!existingProduct) {
		throw new Error(`The ID: ${id}, does not exist in the database`);
	}
};

module.exports = {
	isValidRole,
	isExistingEmail,
	isUserExistsById,
	isCategorieExistsById,
	isProductExistsById,
};

const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { User, Categorie, Product, Role } = require('../models');

const allowedCollections = ['users', 'products', 'categories', 'roles'];

const searchUser = async (term, res = response) => {
	const isMongoID = ObjectId.isValid(term);

	if (isMongoID) {
		const user = await User.findById(term);
		return res.status(200).json({
			msg: 'Search runs successfully',
			results: user ? [user] : [],
		});
	}

	const regex = new RegExp(term, 'i');
	const queryState = { state: true };

	const query = {
		$or: [{ name: regex }, { email: regex }],
		$and: [queryState],
	};

	const [users, total] = await Promise.all([User.find(query), User.countDocuments(query)]);

	res.status(200).json({
		msg: 'Search runs successfully',
		total,
		results: users,
	});
};

const searchCategorie = async (term, res = response) => {
	const isMongoID = ObjectId.isValid(term);

	if (isMongoID) {
		const categorie = await Categorie.findById(term);
		return res.status(200).json({
			msg: 'Search runs successfully',
			results: categorie ? [categorie] : [],
		});
	}

	const regex = new RegExp(term, 'i');
	const queryState = { state: true };

	const query = {
		$or: [{ name: regex }],
		$and: [queryState],
	};

	const [categories, total] = await Promise.all([Categorie.find(query), Categorie.countDocuments(query)]);

	res.status(200).json({
		msg: 'Search runs successfully',
		total,
		results: categories,
	});
};

const searchProduct = async (term, res = response) => {
	const isMongoID = ObjectId.isValid(term);

	if (isMongoID) {
		const product = await Product.findById(term).populate('categorie', 'name').populate('user', 'name');
		return res.status(200).json({
			msg: 'Search runs successfully',
			results: product ? [product] : [],
		});
	}

	const regex = new RegExp(term, 'i');
	const queryState = { state: true };

	const query = {
		$or: [{ name: regex }, { description: regex }],
		$and: [queryState],
	};

	const [products, total] = await Promise.all([Product.find(query).populate('categorie', 'name').populate('user', 'name'), Product.countDocuments(query)]);

	res.status(200).json({
		msg: 'Search runs successfully',
		total,
		results: products,
	});
};

const search = async (req = request, res = response) => {
	try {
		const { collection, term } = req.params;

		if (!allowedCollections.includes(collection)) {
			return res.status(400).json({
				msg: `allowed collections are: ${allowedCollections}`,
			});
		}

		switch (collection) {
			case 'users':
				searchUser(term, res);
				break;
			case 'categories':
				searchCategorie(term, res);
				break;
			case 'products':
				searchProduct(term, res);
				break;
			case 'roles':
				break;
			default:
				res.status(500).json({
					msg: 'You forgot to do this search',
				});
				break;
		}
	} catch (error) {
		res.status(500).json({
			msg: 'Internal Server Error',
			error,
		});
	}
};

module.exports = {
	search,
};

const { request, response } = require('express');
const { Categorie } = require('../models');

const getCategories = async (req = request, res = response) => {
	try {
		const { limit = 5, from = 0 } = req.query;
		const query = { state: true };

		const [categories, total] = await Promise.all([
			Categorie.find(query).populate('user', 'name').skip(Number(from)).limit(Number(limit)),
			Categorie.countDocuments(query),
		]);

		res.status(200).json({
			msg: 'Categories consulted successfully',
			total,
			categories,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Internal Server Error',
			error,
		});
	}
};

const getCategorieById = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const categorie = await Categorie.findById(id).populate('user', 'name');

		res.status(200).json({
			msg: 'Categorie consulted successfully',
			categorie,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Internal Server Error',
			error,
		});
	}
};

const addCategorie = async (req = request, res = response) => {
	try {
		const name = req.body.name.toUpperCase();
		const categorieDB = await Categorie.findOne({ name });

		if (categorieDB) {
			return res.status(400).json({
				msg: `The ${categorieDB.name} category already exists`,
			});
		}

		const data = {
			name,
			user: req.user._id,
		};

		const categorie = new Categorie(data);

		await categorie.save();

		res.status(201).json({
			msg: 'Categorie created successfully',
			categorie,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Internal Server Error',
			error,
		});
	}
};

const updateCategorie = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const { state, user, ...data } = req.body;

		data.name = data.name.toUpperCase();
		data.user = req.user._id;

		const categorie = await Categorie.findByIdAndUpdate(id, data, { new: true });

		res.status(200).json({
			msg: 'Categorie updated successfully',
			categorie,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Internal Server Error',
			error,
		});
	}
};

const deleteCategorie = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const categorie = await Categorie.findByIdAndUpdate(id, { state: false }, { new: true });

		res.status(201).json({
			msg: 'Categorie status changed successfully',
			categorie,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Internal Server Error',
			error,
		});
	}
};

module.exports = {
	addCategorie,
	getCategories,
	getCategorieById,
	updateCategorie,
	deleteCategorie,
};

const { request, response } = require('express');
const { Product } = require('../models');

const getProducts = async (req = request, res = response) => {
	try {
		const { limit = 5, from = 0 } = req.query;
		const query = { state: true };

		const [products, total] = await Promise.all([
			Product.find(query).populate('user', 'name').populate('categorie', 'name').skip(Number(from)).limit(Number(limit)),
			Product.countDocuments(query),
		]);

		res.status(200).json({
			msg: 'Products consulted successfully',
			total,
			products,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Internal Server Error',
			error,
		});
	}
};

const getProductById = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const product = await Product.findById(id).populate('user', 'name').populate('categorie', 'name');

		res.status(200).json({
			msg: 'Product consulted successfully',
			product,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Internal Server Error',
			error,
		});
	}
};

const addProduct = async (req = request, res = response) => {
	try {
		const { state, user, ...dataBody } = req.body;
		const productDB = await Product.findOne({ name: dataBody.name.toUpperCase() });

		if (productDB) {
			return res.status(400).json({
				msg: `The ${productDB.name} product already exists`,
			});
		}

		const data = {
			...dataBody,
			name: dataBody.name.toUpperCase(),
			user: req.user._id,
		};

		const product = new Product(data);

		await product.save();

		res.status(201).json({
			msg: 'Product created successfully',
			product,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Internal Server Error',
			error,
		});
	}
};

const updateProduct = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const { state, user, ...data } = req.body;

		if (data.name) {
			data.name = data.name.toUpperCase();
		}
		data.user = req.user._id;

		const product = await Product.findByIdAndUpdate(id, data, { new: true });

		res.status(200).json({
			msg: 'Product updated successfully',
			product,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Internal Server Error',
			error,
		});
	}
};

const deleteProduct = async (req = request, res = response) => {
	try {
		const { id } = req.params;
		const product = await Product.findByIdAndUpdate(id, { state: false }, { new: true });

		res.status(201).json({
			msg: 'Product status changed successfully',
			product,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Internal Server Error',
			error,
		});
	}
};

module.exports = {
	addProduct,
	getProducts,
	getProductById,
	updateProduct,
	deleteProduct,
};

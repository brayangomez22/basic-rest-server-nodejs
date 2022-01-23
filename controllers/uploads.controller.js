const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require('express');

const { User, Product } = require('../models');
const { uploadFileHelper } = require('../helpers');

const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'txt', 'md'];

const uploadFile = async (req = request, res = response) => {
	try {
		const name = await uploadFileHelper(req.files, allowedExtensions, 'images');

		res.status(200).json({
			msg: 'File uploaded successfully',
			name,
		});
	} catch (msg) {
		res.status(400).json({ msg });
	}
};

const updateImage = async (req = request, res = response) => {
	try {
		const { collection, id } = req.params;
		let model;

		switch (collection) {
			case 'users':
				model = await User.findById(id);
				if (!model) {
					return res.status(400).json({ msg: `There is no user with id ${id}` });
				}
				break;

			case 'products':
				model = await Product.findById(id);
				if (!model) {
					return res.status(400).json({ msg: `There is no product with id ${id}` });
				}
				break;
			default:
				return res.status(500).json({ msg: 'Unimplemented collection' });
		}

		if (model.img) {
			const nameArr = model.img.split('/');
			const name = nameArr[nameArr.length - 1];
			const [public_id] = name.split('.');
			cloudinary.uploader.destroy(public_id);
		}

		const { tempFilePath } = req.files.fileNode;
		const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

		model.img = secure_url;
		await model.save();

		res.status(200).json({
			msg: 'Update successfully',
			model,
		});
	} catch (error) {
		res.status(500).json({
			msg: 'Internal Server Error',
			error,
		});
	}
};

const getImage = async (req = request, res = response) => {
	try {
		const { collection, id } = req.params;
		let model;

		switch (collection) {
			case 'users':
				model = await User.findById(id);
				if (!model) {
					return res.status(400).json({ msg: `There is no user with id ${id}` });
				}
				break;

			case 'products':
				model = await Product.findById(id);
				if (!model) {
					return res.status(400).json({ msg: `There is no product with id ${id}` });
				}
				break;
			default:
				return res.status(500).json({ msg: 'Unimplemented collection' });
		}

		if (model.img) {
			const pathImage = path.join(__dirname, '../uploads/', collection, model.img);
			if (fs.existsSync(pathImage)) {
				return res.sendFile(pathImage);
			}
		}

		const pathImage = path.join(__dirname, '../assets/', 'no-image.jpg');

		return res.sendFile(pathImage);
	} catch (error) {
		res.status(500).json({
			msg: 'Internal Server Error',
			error,
		});
	}
};

module.exports = {
	uploadFile,
	updateImage,
	getImage,
};

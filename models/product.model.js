const { Schema, model } = require('mongoose');

const ProductsSchema = Schema({
	name: {
		type: String,
		required: [true, 'The name is required'],
		unique: true,
	},
	img: {
		type: String,
	},
	state: {
		type: Boolean,
		default: true,
		required: true,
	},
	price: {
		type: Number,
		default: 0,
	},
	description: {
		type: String,
		required: [true, 'The description is required'],
	},
	available: {
		type: Boolean,
		default: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	categorie: {
		type: Schema.Types.ObjectId,
		ref: 'Categorie',
		required: true,
	},
});

ProductsSchema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject();

	object.uid = _id;
	return object;
});

module.exports = model('Product', ProductsSchema);

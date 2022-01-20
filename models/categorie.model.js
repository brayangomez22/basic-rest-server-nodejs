const { Schema, model } = require('mongoose');

const CategoriesSchema = Schema({
	name: {
		type: String,
		required: [true, 'The name is required'],
		unique: true,
	},
	state: {
		type: Boolean,
		default: true,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

CategoriesSchema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject();

	object.uid = _id;
	return object;
});

module.exports = model('Categorie', CategoriesSchema);

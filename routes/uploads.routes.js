const { Router } = require('express');
const { check } = require('express-validator');

const { isCollectionAllowed } = require('../helpers');
const { validateJWT, validateFields, validateFile } = require('../middlewares');
const { uploadFile, updateImage, getImage } = require('../controllers');

const router = Router();

router.post('/', [validateJWT, validateFile], uploadFile);

router.put(
	'/:collection/:id',
	[validateJWT, validateFile, check('collection').custom(isCollectionAllowed), check('id', 'Not a valid ID').isMongoId(), validateFields],
	updateImage
);

router.get(
	'/:collection/:id',
	[validateJWT, check('collection').custom(isCollectionAllowed), check('id', 'Not a valid ID').isMongoId(), validateFields],
	getImage
);

module.exports = router;

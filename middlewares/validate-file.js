const { request, response } = require('express');

const validateFile = async (req = request, res = response, next) => {
	if (!req.files || Object.keys(req.files).length === 0 || !req.files.fileNode) {
		return res.status(400).json({
			msg: 'No files were uploaded.',
		});
	}

	next();
};

module.exports = {
	validateFile,
};

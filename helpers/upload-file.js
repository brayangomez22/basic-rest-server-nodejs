const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFileHelper = (files, allowedExtensions, folder = '') => {
	return new Promise((resolve, reject) => {
		const { fileNode } = files;
		const nameSplit = fileNode.name.split('.');
		const extension = nameSplit[nameSplit.length - 1];

		if (!allowedExtensions.includes(extension)) {
			return reject(`The extension ${extension} is not valid`);
		}

		const nameTemp = uuidv4() + '.' + extension;
		const uploadPath = path.join(__dirname, '../uploads/', folder, nameTemp);

		fileNode.mv(uploadPath, (err) => {
			if (err) {
				return reject(err);
			}

			resolve(nameTemp);
		});
	});
};

module.exports = {
	uploadFileHelper,
};

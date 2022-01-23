const validateJWT = require('./validate-jwt');
const validateRoles = require('./validate-roles');
const validateFields = require('./validate-fields');
const validateFile = require('./validate-file');

module.exports = {
	...validateJWT,
	...validateRoles,
	...validateFields,
	...validateFile,
};

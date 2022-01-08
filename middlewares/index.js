const validateJWT = require('./validate-jwt');
const validateRoles = require('./validate-roles');
const validateFields = require('./validate-fields');

module.exports = {
	...validateJWT,
	...validateRoles,
	...validateFields,
};

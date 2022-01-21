const { Router } = require('express');

const { validateJWT } = require('../middlewares');
const { search } = require('../controllers/searches.controller');

const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.get('/:collection/:term', [validateJWT], search);

module.exports = router;

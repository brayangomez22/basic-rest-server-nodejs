const { Router } = require('express');

const { validateJWT } = require('../middlewares');
const { search } = require('../controllers');

const router = Router();

router.get('/:collection/:term', [validateJWT], search);

module.exports = router;

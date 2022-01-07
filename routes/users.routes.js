const { Router } = require('express');
const { getUsers, updateUser, addUser, deleteUser } = require('../controllers/users.controller');

const router = Router();

router.get('/', getUsers);

router.put('/:id', updateUser);

router.post('/', addUser);

router.delete('/', deleteUser);

module.exports = router;

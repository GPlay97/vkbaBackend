const express = require('express');
const router = express.Router();
const users = require('../controllers/users');

router.get('/', users.getUsers);
router.get('/:name', users.getUser);

router.post('/:name', users.isValidRegistration, users.registerUser);
router.post('/:name/login', users.isValidLogin, users.loginUser);
router.post('/:name/verify', users.verifyUser);

module.exports = router;

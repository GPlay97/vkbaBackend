const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const bank = require('../controllers/bank');

router.post('/', auth.isAuthenticated, bank.redeemCredits);

module.exports = router;

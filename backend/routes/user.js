const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup); // comment on sait 
router.post('/login', userCtrl.login);

module.exports = router;
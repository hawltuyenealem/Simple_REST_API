const express = require('express');

const router  = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userController  = require('../controllers/users');

router.post('/signUp',userController.user_sign_up);
router.post('/login',userController.user_login)
router.delete('/:userId',userController.user_delete)


module.exports = router;

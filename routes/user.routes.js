const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userController = require('../controlls/user.controller');
router.post('/register',[
    
    body('fullname.firstname').isLength({min:3}).withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),    
    body('password').isLength({min :6}).withMessage("Password must be at least 6 characters long"),
], 

userController.registeruser);
module.exports = router;
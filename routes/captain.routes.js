const express = require('express');
const router = express.Router();
const captainController = require('../controlls/captain.controller');
const captainService = require('../services/captain.service');
const {body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register',
    [
        body('fullname.firstname').notEmpty().withMessage('First name is required'),
        body('fullname.lastname').optional().isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long'),
        body('email').isEmail().withMessage('Please provide a valid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('vehicle.color').notEmpty().withMessage('Vehicle color is required'),
        body('vehicle.plate').notEmpty().withMessage('Vehicle plate is required'),
        body('vehicle.capacity').isInt({ min: 1 }).withMessage('Vehicle capacity must be at least 1'),
        body('vehicle.vehicleType').notEmpty().withMessage('Vehicle type is required')
    ],
    captainController.registerCaptain
);
router.post('/login',
    [
        body('email').isEmail().withMessage('Please provide a valid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    captainController.loginCaptain
);
router.get('/profile', authMiddleware.authCaptain, captainController.getCaptainProfile);

router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain);
router.get('/verify-token', authMiddleware.authCaptain, captainController.verifyToken);

module.exports = router;
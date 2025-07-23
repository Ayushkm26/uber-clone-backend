const CaptainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const BlacklistToken = require('../models/blacklistToken.models.js');
const bcrypt = require('bcrypt');

module.exports.registerCaptain = async (req, res) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { fullname,email,password,vehicle } = req.body;
     const existingCaptain = await CaptainModel.findOne({ email });
    if(existingCaptain) {
        throw new Error('Captain with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const captain = await captainService.createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname || '', // Optional last name
            email,
            password: hashedPassword,
            color: vehicle.color,
            plate: vehicle.plate,
            vehicleType: vehicle.vehicleType,
            capacity: vehicle.capacity
           
        });
        const token = captain.generateAuthToken();
        res.status(201).json({ message: 'Captain registered successfully', captain, token });
    } catch (error) {
        res.status(500).json({ message: error.message });   
    
 }
}   
module.exports.loginCaptain = async (req, res) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }   
    const {email,password}=req.body;
    const  captain =await CaptainModel.findOne({email}).select('+password');
    if (!captain) {
        return res.status(404).json({ message: 'Captain not found' });
    }
    const isMatch = await captain.comparePassword(password);
    if (captain.isBlocked) {
        return res.status(403).json({ message: 'Captain is blocked' });
    }
   
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = captain.generateAuthToken();
    res.cookie('token', token, { httpOnly: true, secure: true });
    
    res.status(200).json({ message: 'Login successful', captain, token });  
}
module.exports.getCaptainProfile = async (req, res) => {
    try {
        const captain = req.captain; // Captured from authCaptain middleware
        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }
        res.status(200).json({ captain });
    } catch (error) {
        console.error('Error fetching captain profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports.logoutCaptain = async (req, res) => {    
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
         const blacklistToken = new BlacklistToken({ token });
          await blacklistToken.save();
        res.clearCookie('token', { httpOnly: true, secure: true });
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Internal server error' });
    }   
}
module.exports.verifyToken = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        const isBlacklisted = await BlacklistToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(403).json({ message: 'Token is blacklisted' });
        }
        res.status(200).json({ message: 'Token is valid' });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
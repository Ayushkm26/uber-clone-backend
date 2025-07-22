const  userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const captainModel = require('../models/captain.model');
const jwt = require('jsonwebtoken');
const BlacklistToken = require('../models/blacklistToken.models.js');
module.exports.authUser= async (req, res, next) => {  
    const token =  req.cookies.token || req.headers.authorization?.split(' ')[1]  // Extract token from Authorization header
      if(!token) {
        return res.status(401).json({ message: 'Unauthorized access' });    
 } 
     const blacklisted = await BlacklistToken.findOne({ token });
     if (blacklisted) {
        return res.status(401).json({ message: 'Token is blacklisted' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        const user = await userModel.findById(decoded.id) // Exclude password from response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user; // Attach user to request object
         return next(); // Call next middleware
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}
module.exports.authCaptain = async (req, res, next) => {    
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    const blacklisted = await BlacklistToken.findOne({ token });
    if (blacklisted) {
        return res.status(401).json({ message: 'Token is blacklisted' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const captain = await captainModel.findById(decoded._id); 
        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }
        req.captain = captain; // Attach captain to request object
        return next(); // Call next middleware
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}


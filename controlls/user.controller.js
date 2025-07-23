const userModel= require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../services/user.services');
const { validationResult } = require('express-validator');
const BlacklistToken = require('../models/blacklistToken.models.js');


module.exports.registeruser = async (req, res,next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); 
        const isUserExist = await userModel.findOne({ email: req.body.email });
        if (isUserExist) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }    
}     
try {
  const {fullname, email, password} = req.body;
     const hashPassword= await bcrypt.hash(password, 10);
     const user = await userService.createUser({firstname:fullname.firstname, lastname: fullname.lastname, email:email, password: hashPassword});
    const token = user.generateAuthToken();
     const userWithoutPassword = await userModel.findById(user._id).select('-password');

       
        res.status(200).json({ token, user: userWithoutPassword })
  
    next(); 
} 
 catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
}
}
module.exports.loginUser= async (req,res,next) =>{
    const errors =validationResult(req);
       if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });    
} 
    const {email,password} = req.body
    const user =await userModel.findOne({email}).select('password');
    if(!user){
      return res.status(401).json({message:"invalid email or password"})
    }
    const isMatch= await user.comparePassword(password)
    if(!isMatch){
         return res.status(401).json({message:"invalid email or password"})
    }

    const token = user.generateAuthToken();
    const userWithoutPassword = await userModel.findById(user._id).select('-password');

        // 5. Send response
        res.cookie('token', token,
           { httpOnly: true, 
            secure: true,
            maxAge: 3 * 60 * 60 * 1000, // 3 hours
           }
          ); // Set token in cookies
        res.status(200).json({ token, user: userWithoutPassword });
} 
module.exports.getUserprofile = async (req, res) => { 
  res.status(200).json(req.user); // Return the authenticated user's profile
}
module.exports.logoutUser = async (req, res) => {
  
    res.clearCookie('token', { httpOnly: true, secure: true });
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (token) {
        // Add token to blacklist
        const blacklistToken = new BlacklistToken({ token });
        await blacklistToken.save();
    }
    // Optionally, you can also remove the token from the user's session or database if needed
    res.status(200).json({ message: 'Logged out successfully' });
    
}
module.exports.verifyToken = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Check if the token is blacklisted
        const isBlacklisted = await BlacklistToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token is blacklisted' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ valid: true, userId: decoded.id });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
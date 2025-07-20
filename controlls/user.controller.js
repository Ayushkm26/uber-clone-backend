const userModel= require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../services/user.services');
const { validationResult } = require('express-validator');


module.exports.registeruser = async (req, res,next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });    
}  
try {
  const {fullname, email, password} = req.body;
     const hashPassword= await bcrypt.hash(password, 10);
     const user = await userService.createUser({firstname:fullname.firstname, lastname: fullname.lastname, email:email, password: hashPassword});
    const token = user.generateAuthToken();
    res.status(201).json({token, user});
    next(); // Call next middleware if needed
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
    res.status(201).json({token, user});
} 
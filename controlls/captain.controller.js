const CaptainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
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
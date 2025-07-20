const userModel = require('../models/user.model.js');
const bcrypt = require('bcrypt');


module.exports.createUser = async ({firstname, lastname, email, password}, res) => {
   
        // Validate input
        if (!firstname || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await  userModel.findOne({ email });
        if (existingUser) {
             throw new Error('User already exists');  
          }
        // Create new user instance
        const user =  await userModel.create({
            fullname: { firstname, lastname: lastname}, // Assuming lastname is optional
            email,
            password
        });
        return user
       
}





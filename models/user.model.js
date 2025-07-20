const mongoose= require('mongoose'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation
const userSchema = new mongoose.Schema({

  fullname: {
    firstname: {
      type: String,
      required: true,
        minlength: [2, 'First name must be at least 2 characters long'],
        maxlength: [30, 'First name must not exceed 30 characters'],     
    },
    lastname: {
      type: String,
       minlength: [2, 'Last name must be at least 2 characters long'],
       maxlength: [30, 'Last name must not exceed 30 characters'],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, 'Email must be at least 5 characters long'],
  },
  password:{
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false, // Exclude password from queries by default
  },
  socketId: {
    type: String,
  } 
});   
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
  return token;
}
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
}
userSchema.methods.hashPassword = async function() {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
}
const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
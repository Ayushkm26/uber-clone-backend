const CaptainModel = require('../models/captain.model');    
module.exports.createCaptain = async ({firstname, 
lastname, email, password, color,plate,vehicleType,capacity}) => {
    if(!firstname || !email || !password || !color || !plate || !vehicleType || !capacity) {
        throw new Error('All fields are required');
    }
    const existingCaptain = await CaptainModel.find({ email });
    if(existingCaptain.length > 0) {
        throw new Error('Captain with this email already exists');
    }
    const captain = CaptainModel.create({   
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            vehicleType,
            capacity
        }
    });
     
return captain;


}           

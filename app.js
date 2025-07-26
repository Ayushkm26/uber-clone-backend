const express =require('express');
const mapsRoutes = require('./routes/map.routes');
const rideRoutes = require('./routes/ride.routes');
const captainRoutes = require('./routes/captain.routes');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(cors()); 
const dotenv = require('dotenv');
const connectDB = require('./db/db');
dotenv.config();
const userRoutes = require('./routes/user.routes'); 
connectDB(); 
app.use(cors({ origin: '*' }));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use("/users",userRoutes) 
app.use('/captains', captainRoutes); 
app.use('/maps', mapsRoutes);
app.use('/rides', rideRoutes);

module.exports = app;  

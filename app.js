const express =require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors()); // Enable CORS for all routes
const dotenv = require('dotenv');
const connectDB = require('./db/db');
dotenv.config();
const userRoutes = require('./routes/user.routes'); 
connectDB(); // Connect to MongoDB
app.use(cors({ origin: '*' }));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use("/users",userRoutes) // Parse URL-encoded bodies
 app.get('/', (req, res) => {
  res.send('Hello World!');
}); 

module.exports = app;  

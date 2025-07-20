const mongoose = require('mongoose');   
function connectDB() {
    const dbURI = process.env.MONGO_URI;
    if (!dbURI) {
        console.error('MongoDB URI is not defined in .env file');
        return;
    }
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));
}
module.exports = connectDB;
const http = require('http');
const app = require('./app');
 
// Import the app from app.jsset
const server = http.createServer(app);   

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
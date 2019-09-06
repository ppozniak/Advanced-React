require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db.js');

const server = createServer();

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL,
  }
})
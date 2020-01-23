require('dotenv').config({ path: 'variables.env' });
const cookieParser = require('cookie-parser');
const createServer = require('./createServer');
const jwt = require('jsonwebtoken');

const server = createServer();

server.express.use(cookieParser());
// Extract user id from JWT (cookies)
server.express.use((req, res, next) => {
  const { token } = req.cookies;

  if(token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }

  next();
});

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL,
  }
})
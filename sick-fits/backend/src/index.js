require("dotenv").config({ path: "variables.env" });
const cookieParser = require("cookie-parser");
const createServer = require("./createServer");
const jwt = require("jsonwebtoken");
const db = require("./db");
const bodyParser = require("body-parser");
const { webhook } = require("./webhook");

const server = createServer();

server.express.use(cookieParser());
// Extract user id from JWT (cookies)
server.express.use((req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }

  next();
});

// Add currently logged user
server.express.use(async (req, res, next) => {
  if (req.userId) {
    req.user = await db.query.user(
      {
        where: {
          id: req.userId
        }
      },
      "{ name, email, permissions, id }"
    );
  }

  next();
});

// Stripe post payment webhook
server.express.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  webhook,
);

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL
  }
});

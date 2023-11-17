const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const chatRouter = require("./routes/chatRoutes");
const messageRouter = require("./routes/messageRoutes");

dotenv.config({ path: "config.env" });
const app = express();

// Allow requests from the origin https://localhost:5173
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

// GLOBAL MIDDLEWARES

// Implement CORS
app.use(cors(corsOptions));

// Development logging
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Serve static files
app.use("/public", express.static(path.join(__dirname, "public")));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/messages", messageRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Error handling middleware in Express - errorController.js
app.use(globalErrorHandler);

module.exports = app;

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { promisify } = require("util");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendTokenResponse = require("../utils/sendTokenResponse");

const signAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

exports.verifyToken = async function (token) {
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.changedPasswordAfter(decoded.iat)) {
      return null; // Or throw an appropriate error
    }
    return user;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null; // Or throw an appropriate error
  }
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    console.log("No token provided");
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401),
    );
  }

  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    console.log("User not found");
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401,
      ),
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    console.log("User recently changed password");
    return next(
      new AppError("User recently changed password! Please log in again.", 401),
    );
  }

  // Grant access to protected route and store user in the request object
  req.user = currentUser;

  next();
});

exports.authCheck = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("No authorization header provided");
    return next(new AppError("No authorization header provided", 401));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    console.log("No token provided");
    return next(new AppError("No token provided", 401));
  }

  const decoded = await this.verifyToken(token);
  if (!decoded) {
    console.log("User not authenticated");
    return res.status(401).json({
      status: "fail",
      message: "User is not authenticated",
      isAuthenticated: false,
    });
  }

  // User is authenticated, proceed to the next middleware or route handler
  console.log("User authenticated");
  res.status(200).json({
    status: "success",
    isAuthenticated: true,
    user: decoded,
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, username } = req.body;
  const newUser = await User.create({ name, email, password, username });

  const accessToken = signAccessToken(newUser._id);
  const refreshToken = signRefreshToken(newUser._id);

  sendTokenResponse(newUser, accessToken, refreshToken, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, username, phonenumber, password } = req.body;

  // 1) Check if email/username/phonenumber and password exist
  if (!((email || username || phonenumber) && password)) {
    console.log("Credentials missing");
    return next(
      new AppError(
        "Please provide email/username/phonenumber and password!",
        400,
      ),
    );
  }

  // 2) Find user by email/username/phonenumber and check if password is correct
  let user;
  if (email) {
    user = await User.findOne({ email }).select("+password");
  } else if (username) {
    user = await User.findOne({ username }).select("+password");
  } else if (phonenumber) {
    user = await User.findOne({ phonenumber }).select("+password");
  }

  if (!user || !(await user.correctPassword(password, user.password))) {
    console.log("Authentication failed");
    return next(new AppError("One of the details is incorrect", 401));
  }

  // 3) If everything ok, send token to client
  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  // Refetch the user in order to populate the user without the password
  user = await User.findById(user._id);

  sendTokenResponse(user, accessToken, refreshToken, 200, res);

  // Emitting a message to inform about the user login
  const io = req.app.get("io");
  io.emit("userLoggedIn", { username: username });
});

exports.refreshAccessToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    console.log("No refresh token provided");
    return next(new AppError("No refresh token provided", 401));
  }

  // Verify the refresh token
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
    );
  } catch (error) {
    console.log("Invalid refresh token");
    return next(new AppError("Invalid refresh token", 401));
  }

  // Issue a new access token
  const newAccessToken = signAccessToken(decoded.id);

  res.status(200).json({
    status: "success",
    accessToken: newAccessToken,
  });
});

exports.logout = (disconnectUserSocket) => (req, res, next) => {
  // Destroy session
  req.session.destroy((err) => {
    if (err) {
      console.log("Session destruction failed");
      return next(new AppError("Session destruction failed", 500));
    }
  });

  // Clear the token and session cookies
  res.clearCookie("refreshToken");
  res.clearCookie("connect.sid", { path: "/" });

  disconnectUserSocket(req.user._id);

  res.status(200).json({
    status: "success",
    message: "You have been logged out",
  });
};

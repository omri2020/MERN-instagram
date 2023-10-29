const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const  sendTokenResponse  = require("../utils/sendTokenResponse");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
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
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // Grant access to protected route and store user in the request object
  req.user = currentUser;
  next();
});

exports.authCheck = catchAsync(async (req, res, next) => {
  if (req.cookies.token) {
    const token = req.cookies.token;
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    res.status(200).json({ isAuthenticated: true, user: user });
  } else {
    res.status(200).json({ isAuthenticated: false, user: {} });
  }
})

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, username } = req.body;
  const newUser = await User.create({ name, email, password, username });

  const token = signToken(newUser._id);

  sendTokenResponse(newUser, token, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, username, phonenumber, password } = req.body;

  // 1) Check if email/username/phonenumber and password exist
  if (!((email || username || phonenumber) && password)) {
    console.log('Credentials missing');
    return next(new AppError("Please provide email/username/phonenumber and password!", 400));
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
    console.log('Authentication failed');
    return next(new AppError("One of the details is incorrect", 401));
  }

  // 3) If everything ok, send token to client
  const token = signToken(user._id);

  // Refetch the user in order to populate the user without the password
  user = await User.findById(user._id);

  sendTokenResponse(user, token, 200, res);

  // Emitting a message to inform about the user login
  const io = req.app.get('io');
  io.emit('userLoggedIn', { username: username });

});


exports.logout = (req, res, next) => {
  // Clear the token cookie
  res.clearCookie('token');

  res.status(200).json({
    status: 'success',
    message: 'You have been logged out'
  });
};


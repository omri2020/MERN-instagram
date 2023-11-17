const AppError = require("../utils/appError");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    console.log(err.message);
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") {
      err = handleCastErrorDB(err);
    } else if (err.code === 11000) {
      err = handleDuplicateFieldsDB(err);
    } else if (err.name === "ValidationError") {
      err = handleValidationErrorDB(err);
    } else if (err.name === "JsonWebTokenError") {
      err = handleJWTError();
    } else if (err.name === "TokenExpiredError") {
      err = handleJWTExpiredError();
    }

    // Log additional error details if necessary
    if (err.additionalInfo) {
      console.error("Additional Error Information:", err.additionalInfo);
    }

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  console.log(message);

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;

  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError("Invalid token. Please log in again!", 401);
};

const handleJWTExpiredError = () => {
  return new AppError("Your token has expired! Please log in again.", 401);
};

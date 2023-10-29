class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // 400 for client error and 500 for server error
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    // Error.captureStackTrace(this, this.constructor); // This will not show the AppError class in the original stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

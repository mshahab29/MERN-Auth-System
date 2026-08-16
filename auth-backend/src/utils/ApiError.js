class ApiError extends Error {
  constructor(statusCode, message) {
    // super calls the parent error constructor, without it message property wouldn't exist.
    super(message);

    this.statusCode = statusCode;
    this.success = false;

    // start the stack trace from where the error was actually created
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;

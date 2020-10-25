class UnauthorizedError extends Error {
  constructor(message, ...rest) {
    super(...rest);
    this.status = 404;
    this.message = message;
  }
}

module.exports = UnauthorizedError;
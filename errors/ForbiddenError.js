const { FORBIDDEN_ERROR_CODE } = require('./errorsCode');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR_CODE;
  }
}

module.exports = {
  ForbiddenError,
};

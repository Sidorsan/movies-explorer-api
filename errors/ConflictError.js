const { CONFLICT_ERROR_CODE } = require('./errorsCode');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_ERROR_CODE;
  }
}

module.exports = {
  ConflictError,
};

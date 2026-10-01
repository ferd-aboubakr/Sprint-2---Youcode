const HttpError = require('../utils/HttpError');

function notFound(req, res, next) {
  next(HttpError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = notFound;

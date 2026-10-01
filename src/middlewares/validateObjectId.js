const HttpError = require('../utils/HttpError');
const isObjectId = require('../utils/isObjectId');

function validateObjectId(paramName = 'id') {
  return (req, res, next) => {
    const value = req.params[paramName];
    if (!isObjectId(value)) {
      return next(HttpError.badRequest(`Invalid ${paramName}: ${value}`));
    }
    return next();
  };
}

module.exports = validateObjectId;

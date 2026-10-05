const mongoose = require('mongoose');
const { nodeEnv } = require('../config/env');

function normalizeError(err) {
  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return { status: 400, message: 'Validation failed', details };
  }
  if (err instanceof mongoose.Error.CastError) {
    return { status: 400, message: `Invalid value for ${err.path}: ${err.value}` };
  }
  if (err && err.code === 11000) {
    return { status: 409, message: 'Duplicate value', details: err.keyValue };
  }
  if (err && err.type === 'entity.parse.failed') {
    return { status: 400, message: 'Malformed JSON body' };
  }

  const status = Number.isInteger(err && err.status) && err.status >= 400 && err.status < 600 ? err.status : 500;
  const message = status === 500 ? 'Internal server error' : err.message;
  return { status, message, details: err && err.details };
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const { status, message, details } = normalizeError(err);

  if (status >= 500 && nodeEnv !== 'test') {
    console.error(err);
  }

  const error = { status, message };
  if (details !== undefined) error.details = details;
  if (status >= 500 && nodeEnv === 'development' && err && err.stack) error.stack = err.stack;

  res.status(status).json({ error });
}

module.exports = errorHandler;

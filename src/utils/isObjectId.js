const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

function isObjectId(value) {
  return typeof value === 'string' && OBJECT_ID_REGEX.test(value);
}

module.exports = isObjectId;

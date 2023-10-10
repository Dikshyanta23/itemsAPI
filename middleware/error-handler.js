const {StatusCodes} = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong',
  };
  //for missing fields
  if (err.name === 'ValidationError') {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
  }
  //for duplicate vals
  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = `Duplicate value for ${Object.keys(
      err.keyValue
    )} field`;
  }
  //for db values and improper id keys
  if (err.name === 'CastError') {
    customError.msg = `No item found with id ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }
  
  return res
    .status(customError.statusCode)
    .json({ message: customError.message });
}

module.exports = errorHandlerMiddleware
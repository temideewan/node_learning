const AppError = require('../Utils/appError');

const uniqueErrorsMap = {
  name: 'The tour name has to be unique',
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const message = Object.keys(err.keyValue)
    .map(
      (key) =>
        `${uniqueErrorsMap[key]}. You entered '${err.keyValue[key]}' for the '${key}' property`,
    )
    .join('\n');
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendProdError = (err, res) => {
  // trusted and expected operational error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // log error
    console.error(`ERROR 💣`, err);
    // send ambiguous error message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log(err);
    let error = { ...err, name: err.name };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.name === 'MongoError' && error.code === 11000)
      error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    sendProdError(error, res);
  }
};

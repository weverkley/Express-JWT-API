import winston from '../config/winston';

module.exports = errorHandler;

function errorHandler(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  if (!err.status) err.status = 500;
  const data = {
    error: true,
    code: err.status,
    message: err.message,
    stack: err.stack
  };

  res.status(err.status).json(data);
  winston.error(data);

  return next();
}
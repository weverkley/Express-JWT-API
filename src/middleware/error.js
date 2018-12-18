import winston from '../config/winston';

module.exports = errorHandler;

function errorHandler(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  res.status(err.status || 500);
  if (err.status === 401) {
    return res.json({ error: true, code: err.status, message: 'Not authorized! ' + err.message });
  }

  if (err.status === 403) {
    return res.json({ error: true, code: err.status, message: 'Action forbidden! ' + err.message });
  }

  if (err.status === 404) {
    return res.json({ error: true, code: err.status, message: 'Page not found! ' + err.message });
  }

  // when status is 500, error handler
  if (err.status === 500) {
    return res.json({ error: true, code: err.status, message: 'Server error occured!' + err.message });
  }
}
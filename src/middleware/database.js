import pool from '../config/pool-factory';

module.exports = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) return next(err);
    req.connection = connection;
    next();
    res.on('finish', () => req.connection.release());
  });
};
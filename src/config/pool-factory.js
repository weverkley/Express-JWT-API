import mysql from 'mysql';

const pool = mysql.createPool({
  // connectionLimit: 10,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: 'utc'
});
// console.log('pool => criado');
// pool.on('release', () => console.log('pool => conexão retornada'));
process.on('SIGINT', () =>
  pool.end(err => {
    if (err) return next(err);
    // console.log('pool => fechado');
    process.exit(0);
  })
);

export default pool;
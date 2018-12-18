import mysql from 'mysql';

const pool = mysql.createPool({
  // connectionLimit: 10,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
// console.log('pool => created');
// pool.on('release', () => console.log('pool => connection returned'));
process.on('SIGINT', () =>
  pool.end(err => {
    if (err) return console.log(err);
    // console.log('pool => closed');
    process.exit(0);
  })
);

export default pool;
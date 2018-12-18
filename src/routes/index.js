import express from 'express';
import winston from '../config/winston';
import User from '../models/user';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  let languages = [
    {
      language: 'Spanish'
    },
    {
      language: "French"
    },
    {
      langauge: "German"
    }
  ];
  res.json(languages);
});

router.get('/users', (req, res, next) => {
  let users = [
    new User('James Coonce', 'jcoonce', 'none@none.com'),
    new User('Bob Coonce', 'bcoonce', 'none@none.com'),
    new User('Euri', 'euri', 'none@none.com'),
    new User('Norman', 'jcoonce', 'none@none.com'),
  ];

  res.json(users);
});

router.post('/user/create', (req, res) => {
  let user = new User(req.body.name,
    req.body.username, req.body.email);
  res.json(user);
});

router.get('/user/test', (req, res, next) => {
  req.connection.query(`SELECT * FROM users`, (error, results, fields) => {
    if (error) {
      winston.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      res.json({ error: true, code: error.status || 500, message: error.message });
      return next(error);
    }
    res.json({ error: false, data: results, message: "" });
  });
});

export default router;
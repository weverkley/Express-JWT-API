import express from 'express';
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
  // req.connection.query('SELECT * FROM user', (err, result) => {
  //   if (err) return next(err);
  //   res.json(result);
  //   // não preciso me preocupar em devolver a conexão para o pool
  // });
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
})

export default router;
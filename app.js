require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const NotFoundError = require('./errors/not-found-err.js');
const { auth } = require('./middlewares/auth');
const { errors } = require('celebrate');
const { PORT = 3001 } = process.env;
const app = express();
const { login, createUser } = require('./controllers/user');
const cardsRouter = require('./routes/cards.js');
const cors = require('cors')

app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Please try later',
});

app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// app.use((req, res, next) => {
//   req.user = {
//     _id: '5f6c85db4d5532205863749b',
//   };
//   next();
// });

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/', require('./routes/users'));
app.use('/', cardsRouter);

app.use(() => {
  throw new NotFoundError({ message: 'Запрашиваемый ресурс не найден' });
});
app.use(errors());

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send(err.message);
    return;
  }
  res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
  next();
});

app.listen(PORT, (3001));

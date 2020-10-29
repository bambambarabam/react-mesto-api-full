require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
// const NotFoundError = require('./errors/not-found-err.js');
const { auth } = require('./middlewares/auth');
// eslint-disable-next-line import/order
const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const app = express();
const { login, createUser } = require('./controllers/user');
const cardsRouter = require('./routes/cards.js');
const usersRouter = require('./routes/users.js');
// eslint-disable-next-line import/order
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validateUser } = require('./middlewares/reqValidation');

app.use(cookieParser());

app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Попробуйте зайти позднее',
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

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateUser, login);
app.post('/signup', validateUser, createUser);

app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// app.use(() => {
//   throw new NotFoundError({ message: 'Запрашиваемый ресурс не найден' });
// });

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send(err.message);
    return;
  }
  res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
  next();
});

app.listen(PORT, (3000));

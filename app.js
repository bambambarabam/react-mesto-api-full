const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const { PORT = 3000 } = process.env;
const app = express();
const usersRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards.js');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Please try later',
});

app.use(limiter);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '5f6c85db4d5532205863749b',
  };
  next();
});

app.use('/', usersRouter);
app.use('/', cardsRouter);
app.all('/*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, (3000));

const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const ValidationError = require('../errors/validation-err');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже зарегистрирован');
      } else next(err);
    })
    .then((user) => res.status(201).send({
      name: user.name, about: user.about, avatar, email: user.email
    }))
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) =>
      res.send(users))
    .catch(next)
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params._id)
    .orFail()
    .catch(() => {
      throw new NotFoundError({ message: 'Нет пользователя с таким id' })
    })
    .then((user) => res.send(user))
    .catch(next)
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        throw err;
      }
      throw new ValidationError({ message: `Некорректные данные: ${err.message}` });
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        throw err;
      }
      throw new ValidationError({ message: `Некорректный адрес: ${err.message}` });
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({
          _id: user._id
        }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }),
      });
    })
    .catch(next);
};
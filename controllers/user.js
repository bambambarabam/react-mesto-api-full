const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, avatar, about, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .send({ message: 'Данные введены не верно' });
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
  // .catch((err) => {
  //   if (err.name === 'CastError') {
  //     res.status(404)
  //       .send({ message: 'Данные не найдены' });
  //   } else {
  //     res.status(500)
  //       .send({ message: 'Internal server error' });
  //   }
  // });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404)
          .send({ message: 'Данные не найдены' });
      } else {
        res.status(500)
          .send({ message: 'Internal server error' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404)
          .send({ message: 'Данные не найдены' });
      } else {
        res.status(500)
          .send({ message: 'Internal server error' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404)
          .send({ message: 'Данные не найдены' });
      } else {
        res.status(500)
          .send({ message: 'Internal server error' });
      }
    });
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
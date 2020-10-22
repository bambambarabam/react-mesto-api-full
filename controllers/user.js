const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, avatar, about } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .send({ message: 'Данные введены не верно' });
      } else {
        res.status(500)
          .send({ message: 'Internal server error' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
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

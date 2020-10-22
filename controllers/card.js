const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
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

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
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

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => {
      res.status(200).send(card);
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

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      res.status(200).send(card);
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

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      res.status(200).send(card);
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

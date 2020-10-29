const cardsRouter = require('express').Router();
const { validateId, validateCard } = require('../middlewares/reqValidation');
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

cardsRouter.get('/', getCards);
cardsRouter.post('/', validateCard, createCard);
cardsRouter.delete('/:_id', validateId, deleteCard);
cardsRouter.put('/:_id/likes', validateId, likeCard);
cardsRouter.delete('/:_id/likes', validateId, dislikeCard);

module.exports = cardsRouter;

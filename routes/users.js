const usersRouter = require('express').Router();
const { validateId, validateUserUpdate, validateAvatar } = require('../middlewares/reqValidation');

const {
  getUsers,
  getUser,
  getUserId,
  updateAvatar,
  updateProfile,
} = require('../controllers/user');

usersRouter.get('/', getUsers);
usersRouter.get('/me', validateId, getUser);
usersRouter.get('/:_id', validateId, getUserId);
usersRouter.patch('/me', validateUserUpdate, updateProfile);
usersRouter.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = usersRouter;

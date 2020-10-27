const usersRouter = require('express').Router();
const {
  getUsers,
  getUser,
  getUserId,
  updateAvatar,
  updateProfile,
} = require('../controllers/user');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getUser);
usersRouter.get('/:userId', getUserId);
usersRouter.patch('/users/me', updateProfile);
usersRouter.patch('/users/me/avatar', updateAvatar);

module.exports = usersRouter;

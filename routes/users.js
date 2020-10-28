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
usersRouter.patch('/me', updateProfile);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;

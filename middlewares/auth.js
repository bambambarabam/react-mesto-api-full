const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.headers.authorization &&
    req.headers.authorization.replace('Bearer', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError({ message: 'Необходима авторизация' })
  }
  req.user = payload;
  next();
}
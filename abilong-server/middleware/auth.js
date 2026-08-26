const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/config');
const { HttpStatus } = require('../config/constants');

const protect = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Not authorized, no token' });

  try {
    req.user = jwt.verify(auth.split(' ')[1], SECRET_KEY);
    next();
  } catch {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Token invalid or expired' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.type !== 'admin')
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Admin access required' });
  next();
};

const restrictTo = (...types) => (req, res, next) => {
  if (!types.includes(req.user?.type))
    return res.status(HttpStatus.FORBIDDEN).json({ message: 'You do not have permission to perform this action' });
  next();
};

module.exports = { protect, adminOnly, restrictTo };
const express = require('express');

const {
  getUsers,
  getUser,
  getMe,
  updateMe,
  changeMyPassword,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  signupUser,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');
const { registerValidation, loginValidation, updateUserValidation } = require('../middleware/validationMiddleware');
const { loginLimiter, registerLimiter, writeLimiter } = require('../middleware/rateLimiterMiddleware');

const router = express.Router();

router.post('/login', loginLimiter, loginValidation, loginUser);
router.post('/register', registerLimiter, registerValidation, signupUser);

router.get('/me', protect, getMe);
router.put('/me', protect, writeLimiter, updateUserValidation, updateMe);
router.put('/me/password', protect, writeLimiter, changeMyPassword);

router.route('/').get(protect, adminOnly, getUsers).post(protect, adminOnly, writeLimiter, registerValidation, createUser);
router.route('/:id').get(protect, adminOnly, getUser).put(protect, writeLimiter, updateUserValidation, updateUser).delete(protect, adminOnly, writeLimiter, deleteUser);

module.exports = router;
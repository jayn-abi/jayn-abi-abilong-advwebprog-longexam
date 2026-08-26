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

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', signupUser);

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/me/password', protect, changeMyPassword);

router.route('/').get(protect, adminOnly, getUsers).post(protect, adminOnly, createUser);
router.route('/:id').get(protect, adminOnly, getUser).put(protect, adminOnly, updateUser).delete(protect, adminOnly, deleteUser);

module.exports = router;
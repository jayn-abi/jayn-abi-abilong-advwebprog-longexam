const express = require('express');
const { getArticles, getArticle, createArticle, updateArticle, deleteArticle } = require('../controllers/articleController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getArticles).post(protect, createArticle);
router.route('/:id').get(getArticle).put(protect, updateArticle).delete(protect, deleteArticle);

module.exports = router;

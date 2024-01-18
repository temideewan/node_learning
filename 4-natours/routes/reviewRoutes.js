const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
const {
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
  getReview,
  setTourAndUserId,
} = reviewController;
const { protect, restrictTo } = authController;
router.use(protect);
router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourAndUserId, createReview);

router
  .route('/:id')
  .delete(restrictTo('user', 'admin'), deleteReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .get(getReview);

module.exports = router;

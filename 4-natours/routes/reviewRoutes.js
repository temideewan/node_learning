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
router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourAndUserId, createReview);

router.route('/:id').delete(deleteReview).patch(updateReview).get(getReview);

module.exports = router;

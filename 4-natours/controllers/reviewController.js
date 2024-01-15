const catchAsync = require('../Utils/catchAsync');
const Review = require('../models/reviewModel');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const { review, rating, tour, user } = req.body;
  const newReview = await Review.create({
    review,
    rating,
    tour,
    user,
  });

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const { protect } = authController;
const {
  createTour,
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = tourController;

const router = express.Router();
// a param middleware that activates only on the tour sub application
// router.param('id', tourController.checkID);
router.route('/top-5-tours').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').get(protect, getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;

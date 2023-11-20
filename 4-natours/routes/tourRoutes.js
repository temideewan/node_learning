const express = require('express');
const tourController = require('../controllers/tourController');

const {createTour, getAllTours, getTour,updateTour, deleteTour} = tourController

const router = express.Router();
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;

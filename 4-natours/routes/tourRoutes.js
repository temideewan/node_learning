const express = require('express');
const tourController = require('../controllers/tourController');

const {createTour, getAllTours, getTour,updateTour, deleteTour, checkID, checkBody} = tourController;

const router = express.Router();
// a param middleware that activates only on the tour sub application
router.param('id', checkID)
router.route('/').get(getAllTours).post(checkBody,createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;

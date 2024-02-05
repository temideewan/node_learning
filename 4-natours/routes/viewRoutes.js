const express = require('express');

const {
  getOverview,
  getTour,
  getTourFromSlug,
} = require('../controllers/viewController');

const router = express.Router();
router.get('/', getOverview);
router.get('/tour', getTour);
router.get('/tour/:slug', getTourFromSlug);

module.exports = router;

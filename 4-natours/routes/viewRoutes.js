const express = require('express');

const authController = require('../controllers/authController');

const {
  getOverview,
  getTour,
  getLoginForm,
} = require('../controllers/viewController');

const router = express.Router();
router.use(authController.isLoggedIn);
router.get('/', getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLoginForm);

module.exports = router;

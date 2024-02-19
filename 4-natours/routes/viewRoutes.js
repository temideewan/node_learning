const express = require('express');

const authController = require('../controllers/authController');

const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
} = require('../controllers/viewController');

const router = express.Router();
router.get('/', authController.isLoggedIn, getOverview);
router.get('/tour/:slug', authController.isLoggedIn, getTour);
router.get('/login', authController.isLoggedIn, getLoginForm);
router.get('/me', authController.protect, getAccount);

module.exports = router;

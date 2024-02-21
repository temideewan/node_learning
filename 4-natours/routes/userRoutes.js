const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
} = userController;
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
  logout,
} = authController;
const router = express.Router();

router.get('/me', protect, getMe, getUser);
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword/:token', resetPassword);

// middlewares are executed in sequence
// so placing routes after the protect middleware before the remaining ones, then they would need to be logged in to use any of the routes below
router.use(protect);
router.patch('/updateMyPassword', updatePassword);
router.patch('/updateMe', uploadUserPhoto, updateMe);
router.delete('/deleteMe', deleteMe);
router.use(restrictTo('admin'));
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;

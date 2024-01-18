const User = require('../models/userModel');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');
const { validUpdateProperties } = require('../constants/appConstants');
const { deleteOne, updateOne, getOne, getAll } = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const safeObject = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      safeObject[key] = obj[key];
    }
  });
  return safeObject;
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use sign up instead',
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400,
      ),
    );
  }
  // filter out unwanted field names that are not safe to update
  const filteredBody = filterObj(req.body, ...validUpdateProperties);
  // 2) update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);
exports.deleteUser = deleteOne(User);
// DO NOT UPDATE PASSWORDS WITH THIS.
exports.updateUser = updateOne(User);

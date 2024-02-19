const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');
const sendEmail = require('../Utils/email');
const { anHourAgo, maxLoginRetries } = require('../constants/appConstants');
// eslint-disable-next-line arrow-body-style
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000,
  ),
  httpOnly: true,
};

if (process.env.NODE_ENV === 'production') {
  // makes sure to only send the cookies over https
  cookieOptions.secure = true;
}
const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.cookie('jwt', token, cookieOptions);
  user.failedLoginAttempts = undefined;
  user.isBlocked = undefined;
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
const handleMaxLoginRetries = async (user, password, next) => {
  // if user is not blocked, continue otherwise send blocked response
  if (user.isBlocked) {
    return next(
      new AppError(
        'Your account has been suspended. Please reach out to our support team for help',
        401,
      ),
    );
  }
  if (!(await user.correctPassword(password, user.password))) {
    // update failed login attempts count
    user.failedLoginAttempts = user.failedLoginAttempts
      ? user.failedLoginAttempts + 1
      : 1;
    await user.save({ validateBeforeSave: false });
    if (user.failedLoginAttempts === maxLoginRetries) {
      return next(
        new AppError(
          'Incorrect email or password. Please wait 1 hour before trying to login again, otherwise your account will be blocked',
          401,
        ),
      );
    }
    if (
      user.failedLoginAttempts > maxLoginRetries &&
      user.lastLoginTimestamp.getTime() < anHourAgo
    ) {
      user.isBlocked = true;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError(
          'Your account has been suspended. Please reach out to our support team for help',
          401,
        ),
      );
    }
    // check last login attempt times
    // if failed count is greater than 10 send block warning
    // else if failed count is greater than 10 and  last login attempt it's less than 1 hour ago add user email to blocked user list(i.e set the user blocked to true)
    return next(new AppError('Incorrect email or password', 401));
  }
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });
  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // 2) check if user exists and the password is correct
  // we select user's password because by default on the model level we specified that the password should not be returned.
  // we do that by attaching a select to the query and using + with the missing field.
  const user = await User.findOne({ email }).select(
    '+password +failedLoginAttempts +lastLoginTimestamp +isBlocked',
  );
  if (user) {
    // update the last login time stamp
    user.lastLoginTimestamp = Date.now();
    await handleMaxLoginRetries(user, password, next); //
  }
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // 3) If all check is successful, send token to the user
  user.failedLoginAttempts = 0;
  await user.save({ validateBeforeSave: false });
  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) get the token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );
  }
  // 2) Verification token
  // this step can throw two possible errors that we catch in the error controller. JsonWebTokenError and TokenExpiredError
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists', 401),
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed their password, please login again',
        401,
      ),
    );
  }

  // GRANT ACCESS TO THE PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// only for rendered pages, there will be no error
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // 2) Verification token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );
      // 3) check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 4) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      // every template has access to whatever we put on the res.locals object
      res.locals.user = currentUser;
      return next();
    }
  } catch (error) {
    return next();
  }
  next();
};

// eslint-disable-next-line arrow-body-style
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array of roles
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }
  // 2) Generate the random reset token
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send the reset token(url) to their email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a patch request with your new password and passwordConfirm to: ${resetURL}\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Your password reset token (valid for 10 min)`,
      message,
    });
  } catch (err) {
    // if any errors occur while sending email for reset token then remove it from the user object
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email, Try again later',
        500,
      ),
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email',
  });
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on token

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // set new password only if token has not expired and there is a user, set the new password

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  // update changedPasswordAt property for the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // log the user in, send jwt
  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // because it's a protected route, we have access to the user on the request because it's added from the middleware for protecting a route

  //   1) get user from the collection
  const { id } = req.user;
  const { password, passwordConfirm, passwordCurrent } = req.body;

  const user = await User.findById(id).select('+password');

  //  2) check if the posted password is correct
  if (!(await user.correctPassword(passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }
  // 3) update the password if it is the correct one
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  // 4) log user in, send jwt
  createAndSendToken(user, 200, res);
});

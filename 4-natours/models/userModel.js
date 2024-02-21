const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    maxLength: 40,
    required: [true, 'Please tell us your name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minLength: 8,
    // any query that returns a user will omit this field unless specifically stated using mongoose selection
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      // only works on CREATE and SAVE
      validator: function (value) {
        return this.password === value;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  lastLoginTimestamp: {
    type: Date,
    select: false,
  },
  isBlocked: { type: Boolean, select: false },
  failedLoginAttempts: {
    type: Number,
    select: false,
  },
});

// with middlewares for the database, we handle the edge cases required to step out of the middleware first, and then write code that the specific middleware is handling.
userSchema.pre('save', async function (next) {
  // only run the function if password is modified
  if (!this.isModified('password')) return next();

  // hash the password with a salt of 12
  this.password = await bcrypt.hash(this.password, 12);

  // it's only required as an input but not persisted into the database
  this.passwordConfirm = undefined;
  // go to the next middleware in the stack.
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  // make sure to back date this just in case the token created with this password is created before the document is completely saved.s
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});
// instance method to ensure password is right
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    // getTime on a js date returns in milliseconds divide by 1000 for seconds
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model('User', userSchema);

module.exports = User;

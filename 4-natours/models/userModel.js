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
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minLength: 8,
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
});

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
// instance method to ensure password is right

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

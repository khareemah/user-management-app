const mongoose = require('mongoose');
const validator = require('validator');
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'please provide first name'],
    minLength: 3,
    maxLength: 15,
  },
  lastName: {
    type: String,
    required: [true, 'please provide last name'],
    minLength: 3,
    maxLength: 15,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  age: {
    type: Number,
    required: [true, 'please provide age'],
  },
  gender: {
    type: String,
    required: [true, 'Please provide gender'],
  },
  maritalStatus: {
    type: String,
    required: [true, 'please provide marital status'],
  },
});

module.exports = mongoose.model('User', UserSchema);

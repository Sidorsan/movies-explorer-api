const mongoose = require('mongoose');
// const validator = require('validator');
const regexEmailCheck = require('../util/regex');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      // validate: {
      //   validator(v) {
      //     return validator.isEmail(v);
      //   },
      // },
      pattern: regexEmailCheck,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },

    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('user', userSchema);

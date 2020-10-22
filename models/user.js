const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return /(https?:\/\/)(www\.)?([\w-]+\w{1,})?\.(\w{2,})((\/?)(\w{1,}?)(\/)(\w{1,}?)(\/\w{1,}?)(\/)#?)?/gi.test(value);
      },
      message: 'url error',
    },
  },
});

module.exports = mongoose.model('user', userSchema);

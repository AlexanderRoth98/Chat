const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username : String,
  password : String,
  ip : String,
  avatar: String,


});

module.exports = mongoose.model('User', userSchema);

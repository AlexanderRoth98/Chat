const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  userId : String,
  content : String,
  time : String,
  read : [String],
  imagePath: String,

});

module.exports = mongoose.model('Message', messageSchema);

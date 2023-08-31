const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  gender: String,
  height: Number,
  weight: Number,
  Goals: Array, 
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
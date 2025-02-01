const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phoneno: Number,
});
module.exports = mongoose.model('User', UserSchema);

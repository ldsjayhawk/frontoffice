const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  gmName: { type: String, required: true },
  profslId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  teamCode: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);
module.exports = { User };
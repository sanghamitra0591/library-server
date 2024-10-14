const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'user'],
    default: 'user'
  },
  penalties: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    unique: true,
    default: ""
  }
});

const UserModel = mongoose.model("User", userSchema);

module.exports = {
  UserModel
}
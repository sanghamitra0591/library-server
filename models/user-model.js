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
    type: String
  }
});

const UserModel = mongoose.model("User", userSchema);

module.exports = {
  UserModel
}

// UserModel.collection.dropIndex("category_1", (err, result) => {
//   if (err) {
//     console.log("Error dropping index:", err);
//   } else {
//     console.log("Index dropped:", result);
//   }
// });
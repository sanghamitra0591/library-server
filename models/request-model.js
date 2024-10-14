const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
  userId: {
    type:
      mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  requestAccepted: {
    type: Date,
    required: false
  },
  expectedReturnDate: {
    type: Date,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  returnDate: {
    type: Date,
    required: false,
    default: ""
  },
  penalty: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: true
  }
});
const RequestModel = mongoose.model('Request', requestSchema);

module.exports = {
  RequestModel
}
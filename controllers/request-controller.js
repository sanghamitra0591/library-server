const { BookModel } = require("../models/book-model");
const { RequestModel } = require("../models/request-model");
const { UserModel } = require("../models/user-model");

const createRequest = async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required.' });
    }

    const book = await BookModel.findById(bookId);
    if (!book || book.quantity < 1) {
      return res.status(400).json({ message: 'Book not available' });
    }

    const request = new RequestModel({
      userId: req.user._id,
      bookId,
      category: book.category
    });

    await request.save();

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body;

    if (!requestId) {
      return res.status(400).json({ message: 'Request ID is required.' });
    }

    if (!status || !['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Status must be either "accepted" or "declined".' });
    }

    const request = await RequestModel.findById(requestId).populate('bookId');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.category !== req.user.category) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: 'Unable to change status' });
    }

    if (status === 'accepted') {
      request.status = status;
      request.requestAccepted = new Date();
      request.expectedReturnDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
      await request.save();

      request.bookId.quantity -= 1;
      await request.bookId.save();
    } else if (status === 'declined') {
      request.status = status;
      await request.save();
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const returnRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body;

    if (!requestId) {
      return res.status(400).json({ message: 'Request ID is required.' });
    }

    if (!status || status !== 'returned') {
      return res.status(400).json({ message: 'Status must be "returned".' });
    }

    const request = await RequestModel.findById(requestId).populate('bookId');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const currentDate = new Date();

    if (request.expectedReturnDate < currentDate) {
      const overdueDays = Math.ceil((currentDate - request.expectedReturnDate) / (1000 * 60 * 60 * 24));
      const penaltyToAdd = overdueDays * 50;

      request.penalty += penaltyToAdd;
      await UserModel.findByIdAndUpdate(request.userId, { $inc: { penalties: penaltyToAdd } });
    }

    request.status = status;
    request.returnDate = new Date();
    await request.save();

    request.bookId.quantity += 1;
    await request.bookId.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserRequests = async (req, res) => {
  try {
    const { status } = req.query;

    if (!status) {
      const userRequests = await RequestModel.find({ userId: req.user._id })
        .populate('bookId', 'title quantity publishYear category');

      return res.json(userRequests);
    }

    if (status && !['pending', 'accepted', 'declined', 'returned'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const userRequests = await RequestModel.find({ userId: req.user._id, status })
      .populate('bookId', 'title quantity publishYear category');

    res.json(userRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const allRequests = await RequestModel.find({ category: req.user.category })
      .populate('userId', 'username email penalties')
      .populate('bookId', 'title quantity publishYear category');

    const formattedRequests = allRequests.map(request => ({
      _id: request._id,
      requestDate: request.requestDate,
      requestAccepted: request.requestAccepted,
      expectedReturnDate: request.expectedReturnDate,
      returnDate: request.returnDate,
      category: request.category,
      status: request.status,
      penalty: request.penalty,
      user: request.userId ? {
        id: request.userId._id,
        username: request.userId.username,
        email: request.userId.email,
        penalties: request.userId.penalties,
      } : null,
      book: request.bookId ? {
        id: request.bookId._id,
        title: request.bookId.title,
        quantity: request.bookId.quantity,
        publishYear: request.bookId.publishYear,
        category: request.bookId.category,
      } : null,
    }));

    res.json(formattedRequests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createRequest, handleRequest, returnRequest, getUserRequests, getAllRequests };
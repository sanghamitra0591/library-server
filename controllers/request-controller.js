
const { BookModel } = require("../models/book-model");
const { RequestModel } = require("../models/request-model");

const createRequest = async (req, res) => {
  const { bookId } = req.body;
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
  book.quantity -= 1;
  await book.save();

  res.status(201).json(request);
};


const handleRequest = async (req, res) => {
  const { requestId, status } = req.body;
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
};

const getUserRequests = async (req, res) => {
  const userRequests = await RequestModel.find({ userId: req.user._id }).populate('bookId');
  res.json(userRequests);
};
const getAllRequests = async (req, res) => {
  try {
      const allRequests = await RequestModel.find({ category: req.user.category })
          .populate('userId', 'name email')
          .populate('bookId', 'title author publishYear category');

      const formattedRequests = allRequests.map(request => ({
          _id: request._id,
          requestDate: request.requestDate,
          expectedReturnDate: request.expectedReturnDate,
          status: request.status,
          penalty: request.penalty,
          user: {
              id: request.userId._id,
              name: request.userId.name,
              email: request.userId.email,
          },
          book: {
              id: request.bookId._id,
              title: request.bookId.title,
              author: request.bookId.author,
              publishYear: request.bookId.publishYear,
              category: request.bookId.category,
          }
      }));

      res.json(formattedRequests);
  } catch (error) {
      console.error('Error fetching requests:', error);
      res.status(500).json({ message: 'Server error' });
  }
};






module.exports = { createRequest, handleRequest, getUserRequests, getAllRequests };
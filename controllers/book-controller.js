const { BookModel } = require("../models/book-model");

const addBook = async (req, res) => {
  try {
    const { title, author, quantity, publishYear } = req.body;

    if (!title || !author || quantity === undefined || !publishYear) {
      return res.status(400).json({ message: 'Title, author, quantity, and publish year are required.' });
    }

    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ message: 'Title must be a non-empty string.' });
    }

    if (typeof author !== 'string' || author.trim().length === 0) {
      return res.status(400).json({ message: 'Author must be a non-empty string.' });
    }

    if (typeof quantity !== 'number' || quantity < 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({ message: 'Quantity must be a non-negative integer.' });
    }

    const currentYear = new Date().getFullYear();
    const publishYearNum = parseInt(publishYear, 10);
    if (!/^\d{4}$/.test(publishYear) || publishYearNum < 1000 || publishYearNum > currentYear) {
      return res.status(400).json({ message: 'Publish year must be a valid four-digit year.' });
    }

    if (!req.user || !req.user.category) {
      return res.status(400).json({ message: 'User category is required.' });
    }
    const book = new BookModel({ title, author, category: req.user.category, quantity, publishYear });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBooks = async (req, res) => {
  const books = await BookModel.find();
  res.json(books);
};

const searchBooks = async (req, res) => {
  const { query } = req.params;
  const books = await BookModel.find({ title: new RegExp(query, 'i') });
  res.json(books);
};

module.exports = { addBook, getAllBooks, searchBooks };
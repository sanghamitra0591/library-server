const { BookModel } = require("../models/book-model");
const { RequestModel } = require("../models/request-model");

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
  try {
    let filter = {};
    
    if (req.user.role === "admin") {
      filter.category = req.user.category;
    }
    
    const books = await BookModel.find(filter);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchBooks = async (req, res) => {
  const { query } = req.params;
  const books = await BookModel.find({ title: new RegExp(query, 'i') });
  res.json(books);
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, quantity, publishYear } = req.body;

    if (title && (typeof title !== 'string' || title.trim().length === 0)) {
      return res.status(400).json({ message: 'Title must be a non-empty string.' });
    }

    if (author && (typeof author !== 'string' || author.trim().length === 0)) {
      return res.status(400).json({ message: 'Author must be a non-empty string.' });
    }

    if (quantity !== undefined && (typeof quantity !== 'number' || quantity < 0 || !Number.isInteger(quantity))) {
      return res.status(400).json({ message: 'Quantity must be a non-negative integer.' });
    }

    const currentYear = new Date().getFullYear();
    if (publishYear && (!/^\d{4}$/.test(publishYear) || parseInt(publishYear, 10) < 1000 || parseInt(publishYear, 10) > currentYear)) {
      return res.status(400).json({ message: 'Publish year must be a valid four-digit year.' });
    }

    const book = await BookModel.findByIdAndUpdate(id, { title, author, quantity, publishYear }, { new: true, runValidators: true });
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await BookModel.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    await RequestModel.deleteMany({ bookId: id });

    await BookModel.deleteOne({ _id: id });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = { addBook, getAllBooks, searchBooks, updateBook, deleteBook };
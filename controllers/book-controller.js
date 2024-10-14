const { BookModel } = require("../models/book-model");

const addBook = async (req, res) => {
  const { title, author, quantity, publishYear } = req.body;
  
  const book = new BookModel({ title, author, category:req.user.category, quantity, publishYear });
  await book.save();
  res.status(201).json(book);
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

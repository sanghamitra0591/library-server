const express = require('express');
const { authValidator, roleMiddleware } = require('../middlewares/auth-validator-middleware');
const { addBook, getAllBooks, searchBooks } = require('../controllers/book-controller');
const bookRouter = express.Router();

bookRouter.post('/', authValidator, roleMiddleware(['admin']), addBook);
bookRouter.get('/', authValidator, getAllBooks);
bookRouter.get('/search/:query', authValidator, searchBooks);

module.exports = bookRouter;
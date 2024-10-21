const express = require('express');
const { authValidator, roleMiddleware } = require('../middlewares/auth-validator-middleware');
const { addBook, getAllBooks, searchBooks, updateBook, deleteBook } = require('../controllers/book-controller');
const bookRouter = express.Router();

bookRouter.post('/', authValidator, roleMiddleware(['admin']), addBook);
bookRouter.get('/', authValidator, getAllBooks);
bookRouter.get('/search/:query', authValidator, searchBooks);
bookRouter.put('/:id', authValidator, roleMiddleware(['admin', 'super_admin']), updateBook);
bookRouter.delete('/:id', authValidator, roleMiddleware(['admin', 'super_admin']), deleteBook);

module.exports = bookRouter;
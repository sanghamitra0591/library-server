const express = require('express');
const { authValidator } = require('../middlewares/auth-validator-middleware');
const { getCategories } = require('../controllers/category-controller');
const categoryRouter = express.Router();

categoryRouter.get('/', authValidator, getCategories);

module.exports = categoryRouter;

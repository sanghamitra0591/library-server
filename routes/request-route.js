const express = require('express');
const { createRequest, handleRequest, getUserRequests, getAllRequests } = require('../controllers/request-controller');
const { authValidator, roleMiddleware } = require('../middlewares/auth-validator-middleware');
const requestRouter = express.Router();

requestRouter.post('/', authValidator, roleMiddleware(['user']), createRequest);

requestRouter.post('/handle', authValidator, roleMiddleware(['admin']), handleRequest);

requestRouter.get('/my-requests', authValidator, roleMiddleware(['user']), getUserRequests);

requestRouter.get('/all-requests', authValidator, roleMiddleware(['admin']), getAllRequests);

module.exports = requestRouter;
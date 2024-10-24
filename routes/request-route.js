const express = require('express');
const { createRequest, handleRequest, getUserRequests, getAllRequests, returnRequest, deleteRequest } = require('../controllers/request-controller');
const { authValidator, roleMiddleware } = require('../middlewares/auth-validator-middleware');
const requestRouter = express.Router();

requestRouter.post('/', authValidator, roleMiddleware(['user']), createRequest);

requestRouter.put('/return', authValidator, roleMiddleware(['user']), returnRequest);

requestRouter.put('/handle', authValidator, roleMiddleware(['admin']), handleRequest);

requestRouter.get('/my-requests', authValidator, roleMiddleware(['user']), getUserRequests);

requestRouter.get('/all-requests', authValidator, roleMiddleware(['admin']), getAllRequests);

requestRouter.delete('/:requestId', authValidator, roleMiddleware(['user']), deleteRequest);


module.exports = requestRouter;
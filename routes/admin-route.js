const express = require('express');
const { authValidator, roleMiddleware } = require('../middlewares/auth-validator-middleware');
const { addAdmin, getAllUsers, getAllAdmins } = require('../controllers/admin-controller');
const { getUserRequests } = require('../controllers/request-controller');
const adminRouter = express.Router();

adminRouter.post('/add-admin', authValidator, roleMiddleware(['super_admin']), addAdmin);

adminRouter.get('/users', authValidator, roleMiddleware(['super_admin', 'admin']), getAllUsers);

adminRouter.get('/requests', authValidator, roleMiddleware(['admin', 'super_admin']), getUserRequests);

adminRouter.get('/admins', authValidator, roleMiddleware(['super_admin']), getAllAdmins);

module.exports = adminRouter;
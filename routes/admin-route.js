const express = require('express');
const { authValidator, roleMiddleware } = require('../middlewares/auth-validator-middleware');
const { addAdmin, getAllUsers, getAllAdmins, updateAdmin, deleteAdmin } = require('../controllers/admin-controller');
const { getUserRequests } = require('../controllers/request-controller');
const adminRouter = express.Router();

adminRouter.post('/add-admin', authValidator, roleMiddleware(['super_admin']), addAdmin);

adminRouter.get('/users', authValidator, roleMiddleware(['super_admin', 'admin']), getAllUsers);

adminRouter.get('/requests', authValidator, roleMiddleware(['admin', 'super_admin']), getUserRequests);

adminRouter.get('/admins', authValidator, roleMiddleware(['super_admin']), getAllAdmins);

adminRouter.put('/admins/:adminId', authValidator, roleMiddleware(['super_admin']), updateAdmin);

adminRouter.delete('/admins/:adminId', authValidator, roleMiddleware(['super_admin']), deleteAdmin);

module.exports = adminRouter;
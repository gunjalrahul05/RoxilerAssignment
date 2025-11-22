const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard');
const { authenticate, authorize } = require('../middleware/auth');
const { paginationRules, validate } = require('../middleware/validator');

router.use(authenticate);

router.get(
  '/admin',
  authorize('ADMIN'),
  dashboardController.getAdminDashboard
);

router.get(
  '/store-owner',
  authorize('STORE_OWNER'),
  paginationRules,
  validate,
  dashboardController.getStoreOwnerDashboard
);

module.exports = router;

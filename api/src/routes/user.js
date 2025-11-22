const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { authenticate, authorize } = require('../middleware/auth');
const { userValidationRules, validate, paginationRules } = require('../middleware/validator');

router.use(authenticate);

router.get(
  '/',
  authorize('ADMIN'),
  paginationRules,
  validate,
  userController.getUsers
);

router.get(
  '/:id',
  authorize('ADMIN'),
  userController.getUserById
);

router.post(
  '/',
  authorize('ADMIN'),
  userValidationRules.create,
  validate,
  userController.createUser
);

router.put(
  '/:id',
  authorize('ADMIN'),
  userValidationRules.update,
  validate,
  userController.updateUser
);

router.delete(
  '/:id',
  authorize('ADMIN'),
  userController.deleteUser
);

module.exports = router;

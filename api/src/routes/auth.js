const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authenticate } = require('../middleware/auth');
const { authValidationRules, validate, userValidationRules } = require('../middleware/validator');
const { authLimiter } = require('../middleware/rateLimiter');

router.use(authLimiter);

router.post(
  '/register',
  authValidationRules.register,
  validate,
  authController.register
);

router.post(
  '/login',
  authValidationRules.login,
  validate,
  authController.login
);

router.get(
  '/me',
  authenticate,
  authController.getMe
);

router.put(
  '/password',
  authenticate,
  userValidationRules.changePassword,
  validate,
  authController.updatePassword
);

router.post(
  '/refresh-token',
  authController.refreshToken
);

router.post(
  '/logout',
  authenticate,
  authController.logout
);

module.exports = router;

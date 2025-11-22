const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store');
const { authenticate, authorize } = require('../middleware/auth');
const { storeValidationRules, validate, paginationRules } = require('../middleware/validator');

router.get(
  '/',
  paginationRules,
  validate,
  storeController.getStores
);

router.get(
  '/:id',
  storeController.getStoreById
);

router.use(authenticate);

router.post(
  '/',
  authorize('ADMIN'),
  storeValidationRules.create,
  validate,
  storeController.createStore
);

router.put(
  '/:id',
  authorize('ADMIN'),
  storeValidationRules.update,
  validate,
  storeController.updateStore
);

router.delete(
  '/:id',
  authorize('ADMIN'),
  storeController.deleteStore
);

router.get(
  '/:id/raters',
  authorize('ADMIN', 'STORE_OWNER'),
  paginationRules,
  validate,
  storeController.getStoreRaters
);

module.exports = router;

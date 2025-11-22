const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating');
const { authenticate, authorize } = require('../middleware/auth');
const { ratingValidationRules, validate, paginationRules } = require('../middleware/validator');

router.use(authenticate);

router.get(
  '/',
  authorize('ADMIN'),
  paginationRules,
  validate,
  ratingController.getRatings
);

router.post(
  '/',
  authorize('USER'),
  ratingValidationRules.create,
  validate,
  ratingController.submitRating
);

router.get(
  '/store/:storeId',
  authorize('USER'),
  ratingController.getUserRatingForStore
);

router.get(
  '/count',
  authorize('ADMIN'),
  ratingController.getTotalRatingsCount
);

module.exports = router;

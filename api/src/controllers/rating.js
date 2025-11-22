const Rating = require('../models/rating');
const Store = require('../models/store');

// for getting ratings 
const getRatings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const filters = {
      userId: req.query.userId,
      storeId: req.query.storeId,
      minRating: req.query.minRating,
      maxRating: req.query.maxRating
    };

    const result = await Rating.getAll(page, limit, filters);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

//submit and updating ratings
const submitRating = async (req, res, next) => {
  try {
    const { store_id, rating_value } = req.body;
    const user_id = req.user.id;

   
    const store = await Store.getById(store_id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const existingRating = await Rating.getByUserAndStore(user_id, store_id);

    let rating;
    if (existingRating) {
      rating = await Rating.update(existingRating.id, { rating_value });
    } else {
      rating = await Rating.create({
        user_id,
        store_id,
        rating_value
      });
    }

    res.status(200).json({
      success: true,
      message: existingRating ? 'Rating updated successfully' : 'Rating submitted successfully',
      data: rating
    });
  } catch (error) {
    next(error);
  }
};

//getting user rating for the store
const getUserRatingForStore = async (req, res, next) => {
  try {
    const store_id = req.params.storeId;
    const user_id = req.user.id;

    const store = await Store.getById(store_id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Get user's rating
    const rating = await Rating.getByUserAndStore(user_id, store_id);

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    res.status(200).json({
      success: true,
      data: rating
    });
  } catch (error) {
    next(error);
  }
};

//total rating counts 
const getTotalRatingsCount = async (req, res, next) => {
  try {
    const count = await Rating.getTotalCount();

    res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRatings,
  submitRating,
  getUserRatingForStore,
  getTotalRatingsCount
};

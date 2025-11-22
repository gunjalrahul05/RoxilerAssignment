const User = require('../models/user');
const Store = require('../models/store');
const Rating = require('../models/rating');

//for getting admin dashbaord
const getAdminDashboard = async (req, res, next) => {
  try {

    const usersCountQuery = await User.getAll(1, 1);
    const totalUsers = usersCountQuery.pagination.total;

    const storesCountQuery = await Store.getAll(1, 1);
    const totalStores = storesCountQuery.pagination.total;

    const totalRatings = await Rating.getTotalCount();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStores,
        totalRatings
      }
    });
  } catch (error) {
    next(error);
  }
};

// store owner dashboard
const getStoreOwnerDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get store information
    const store = await Store.getByOwnerId(userId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'You do not have a store assigned'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const ratersResult = await Store.getStoreRaters(store.id, page, limit);

    res.status(200).json({
      success: true,
      data: {
        store: {
          id: store.id,
          name: store.name,
          email: store.email,
          address: store.address,
          averageRating: store.average_rating,
          totalRatings: store.rating_count
        },
        raters: ratersResult.data,
        pagination: ratersResult.pagination
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getStoreOwnerDashboard
};

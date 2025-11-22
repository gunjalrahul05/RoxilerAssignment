const Store = require('../models/store');
const User = require('../models/user');

// list all stores
const getStores = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const filters = {
      name: req.query.name,
      email: req.query.email,
      address: req.query.address
    };

    const userId = req.user ? req.user.id : null;

    const result = await Store.getAll(page, limit, filters, userId);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

//get store by id
const getStoreById = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    
    const store = await Store.getById(req.params.id, userId);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    res.status(200).json({
      success: true,
      data: store
    });
  } catch (error) {
    next(error);
  }
};

// Insert new Store
const createStore = async (req, res, next) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (owner_id) {
      const owner = await User.getById(owner_id);
      if (!owner) {
        return res.status(404).json({
          success: false,
          message: 'Owner not found'
        });
      }

      if (owner.role !== 'STORE_OWNER') {
        return res.status(400).json({
          success: false,
          message: 'User must have a STORE_OWNER role to be assigned as owner'
        });
      }
    }

    const store = await Store.create({
      name,
      email,
      address,
      owner_id: owner_id || null
    });

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: store
    });
  } catch (error) {
    next(error);
  }
};

//Update the store 
const updateStore = async (req, res, next) => {
  try {
    const { name, email, address, owner_id } = req.body;
    const storeId = req.params.id;

    const store = await Store.getById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    if (owner_id) {
      const owner = await User.getById(owner_id);
      if (!owner) {
        return res.status(404).json({
          success: false,
          message: 'Owner not found'
        });
      }

      if (owner.role !== 'STORE_OWNER') {
        return res.status(400).json({
          success: false,
          message: 'User must have a STORE_OWNER role to be assigned as owner'
        });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (address) updateData.address = address;
    if (owner_id !== undefined) updateData.owner_id = owner_id;

    const updatedStore = await Store.update(storeId, updateData);

    res.status(200).json({
      success: true,
      message: 'Store updated successfully',
      data: updatedStore
    });
  } catch (error) {
    next(error);
  }
};

// Delete the Store
const deleteStore = async (req, res, next) => {
  try {
    const storeId = req.params.id;

    const store = await Store.getById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    await Store.delete(storeId);

    res.status(200).json({
      success: true,
      message: 'Store deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// List user who rate the store
const getStoreRaters = async (req, res, next) => {
  try {
    const storeId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const store = await Store.getById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    if (req.user.role === 'STORE_OWNER') {
      const userStore = await Store.getByOwnerId(req.user.id);
      if (!userStore || userStore.id !== parseInt(storeId)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to access this resource'
        });
      }
    }

    const result = await Store.getStoreRaters(storeId, page, limit);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  getStoreRaters
};

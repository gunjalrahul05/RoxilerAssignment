const User = require('../models/user');
const { hashPassword } = require('../utils/auth');

// get all the users 
const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const filters = {
      name: req.query.name,
      email: req.query.email,
      address: req.query.address,
      role: req.query.role
    };

    const result = await User.getAll(page, limit, filters);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

// get user by id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.getById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// create new user
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await User.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    
    const hashedPassword = await hashPassword(password);

    const roleId = await User.getRoleIdByName(role);
    if (!roleId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role_id: roleId
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

//update the existring user
const updateUser = async (req, res, next) => {
  try {
    const { name, email, address, role } = req.body;
    const userId = req.params.id;

    const user = await User.getById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (address) updateData.address = address;
    
    if (role) {
      const roleId = await User.getRoleIdByName(role);
      if (!roleId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role'
        });
      }
      updateData.role_id = roleId;
    }

    const updatedUser = await User.update(userId, updateData);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

//Delete the user

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.getById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.delete(userId);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};

const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }
  next();
};

const userValidationRules = {
  create: [
    body('name')
      .isLength({ min: 20, max: 60 })
      .withMessage('Name must be between 20 and 60 characters'),
    body('email')
      .isEmail()
      .withMessage('Must provide a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8, max: 16 })
      .withMessage('Password must be between 8 and 16 characters')
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
      .withMessage('Password must include at least one uppercase letter and one special character'),
    body('address')
      .isLength({ max: 400 })
      .withMessage('Address must not exceed 400 characters'),
    body('role')
      .isString()
      .isIn(['ADMIN', 'USER', 'STORE_OWNER'])
      .withMessage('Role must be ADMIN, USER, or STORE_OWNER')
  ],
  update: [
    body('name')
      .optional()
      .isLength({ min: 20, max: 60 })
      .withMessage('Name must be between 20 and 60 characters'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Must provide a valid email address')
      .normalizeEmail(),
    body('address')
      .optional()
      .isLength({ max: 400 })
      .withMessage('Address must not exceed 400 characters'),
    body('role')
      .optional()
      .isString()
      .isIn(['ADMIN', 'USER', 'STORE_OWNER'])
      .withMessage('Role must be ADMIN, USER, or STORE_OWNER')
  ],
  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8, max: 16 })
      .withMessage('Password must be between 8 and 16 characters')
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
      .withMessage('Password must include at least one uppercase letter and one special character')
  ]
};

const storeValidationRules = {
  create: [
    body('name')
      .notEmpty()
      .withMessage('Store name is required'),
    body('email')
      .isEmail()
      .withMessage('Must provide a valid email address')
      .normalizeEmail(),
    body('address')
      .notEmpty()
      .withMessage('Store address is required')
      .isLength({ max: 400 })
      .withMessage('Address must not exceed 400 characters'),
    body('owner_id')
      .optional()
      .isInt()
      .withMessage('Owner ID must be an integer')
  ],
  update: [
    body('name')
      .optional()
      .notEmpty()
      .withMessage('Store name is required'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Must provide a valid email address')
      .normalizeEmail(),
    body('address')
      .optional()
      .isLength({ max: 400 })
      .withMessage('Address must not exceed 400 characters'),
    body('owner_id')
      .optional()
      .isInt()
      .withMessage('Owner ID must be an integer')
  ]
};

const ratingValidationRules = {
  create: [
    body('store_id')
      .isInt()
      .withMessage('Store ID must be an integer'),
    body('rating_value')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be an integer between 1 and 5')
  ],
  update: [
    body('rating_value')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be an integer between 1 and 5')
  ]
};

const authValidationRules = {
  login: [
    body('email')
      .isEmail()
      .withMessage('Must provide a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  register: [
    body('name')
      .isLength({ min: 20, max: 60 })
      .withMessage('Name must be between 20 and 60 characters'),
    body('email')
      .isEmail()
      .withMessage('Must provide a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8, max: 16 })
      .withMessage('Password must be between 8 and 16 characters')
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
      .withMessage('Password must include at least one uppercase letter and one special character'),
    body('address')
      .isLength({ max: 400 })
      .withMessage('Address must not exceed 400 characters')
  ]
};

const paginationRules = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt()
];

module.exports = {
  validate,
  userValidationRules,
  storeValidationRules,
  ratingValidationRules,
  authValidationRules,
  paginationRules
};

const express = require('express');
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/CustomerController');
const { protect } = require('../middleware/Auth');
const {
  validateCustomer,
  validateCustomerUpdate,
  validateObjectId,
  validateCustomerQuery,
} = require('../middleware/Validate');

const router = express.Router();

// Every customer route requires a logged-in user
router.use(protect);

router
  .route('/')
  .get(validateCustomerQuery, getCustomers)
  .post(validateCustomer, createCustomer);

router
  .route('/:id')
  .all(validateObjectId) // 400 for malformed ids before hitting the database
  .get(getCustomerById)
  .put(validateCustomerUpdate, updateCustomer)
  .delete(deleteCustomer);

module.exports = router;

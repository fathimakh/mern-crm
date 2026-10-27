const express = require('express');
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/CustomerController');
const { protect } = require('../middleware/Auth');

const router = express.Router();

// Every customer route requires a logged-in user
router.use(protect);

router.route('/').get(getCustomers).post(createCustomer);

router.route('/:id').get(getCustomerById).put(updateCustomer).delete(deleteCustomer);

module.exports = router;

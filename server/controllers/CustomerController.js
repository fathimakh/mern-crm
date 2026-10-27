const Customer = require('../models/CustomerModel');
const ApiError = require('../utils/ApiError');
const { CUSTOMER_STATUSES } = require('../utils/validators');

// Only these fields can be set by the client (prevents overwriting `user`, `_id`, ...)
const EDITABLE_FIELDS = ['name', 'email', 'phone', 'company', 'status', 'notes'];

const pickEditableFields = (body) =>
  Object.fromEntries(EDITABLE_FIELDS.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]));

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const duplicateEmailError = () => {
  const message = 'A customer with this email already exists';
  return new ApiError(409, message, { email: message });
};

/**
 * @route   GET /api/customers?search=&status=
 * @access  Private
 */
const getCustomers = async (req, res) => {
  const filter = { user: req.user._id };
  const { search, status } = req.query;

  if (typeof status === 'string' && status) {
    if (!CUSTOMER_STATUSES.includes(status)) {
      throw new ApiError(400, `Status must be one of: ${CUSTOMER_STATUSES.join(', ')}`);
    }
    filter.status = status;
  }

  if (typeof search === 'string' && search.trim()) {
    const pattern = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ name: pattern }, { email: pattern }, { company: pattern }, { phone: pattern }];
  }

  const customers = await Customer.find(filter).sort({ createdAt: -1 });

  res.json({ success: true, count: customers.length, customers });
};

/**
 * @route   GET /api/customers/:id
 * @access  Private
 */
const getCustomerById = async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id, user: req.user._id });
  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  res.json({ success: true, customer });
};

/**
 * @route   POST /api/customers
 * @access  Private
 */
const createCustomer = async (req, res) => {
  const data = pickEditableFields(req.body);

  if (await Customer.exists({ user: req.user._id, email: data.email })) {
    throw duplicateEmailError();
  }

  const customer = await Customer.create({ ...data, user: req.user._id });

  res.status(201).json({ success: true, message: 'Customer added successfully', customer });
};

/**
 * @route   PUT /api/customers/:id
 * @access  Private
 */
const updateCustomer = async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id, user: req.user._id });
  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  const updates = pickEditableFields(req.body);

  if (
    updates.email &&
    (await Customer.exists({ user: req.user._id, email: updates.email, _id: { $ne: customer._id } }))
  ) {
    throw duplicateEmailError();
  }

  Object.assign(customer, updates);
  await customer.save(); // runs schema validation again

  res.json({ success: true, message: 'Customer updated successfully', customer });
};

/**
 * @route   DELETE /api/customers/:id
 * @access  Private
 */
const deleteCustomer = async (req, res) => {
  const customer = await Customer.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  res.json({ success: true, message: 'Customer deleted successfully', customer: { _id: customer._id } });
};

module.exports = { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer };

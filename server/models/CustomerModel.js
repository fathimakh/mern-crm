const mongoose = require('mongoose');
const { EMAIL_REGEX, CUSTOMER_STATUSES, isValidPhone } = require('../utils/validators');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Customer email is required'],
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: isValidPhone,
        message: 'Please provide a valid phone number (7-15 digits)',
      },
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: CUSTOMER_STATUSES,
        message: `Status must be one of: ${CUSTOMER_STATUSES.join(', ')}`,
      },
      default: 'Lead',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    // The logged-in user who owns this customer record
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// A user cannot store the same customer email twice (also serves user-scoped queries)
customerSchema.index({ user: 1, email: 1 }, { unique: true });

customerSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Customer', customerSchema);

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  // অ্যাডমিন প্যানেল থেকে বোঝার জন্য যে মেসেজটা পড়া হয়েছে কি না
  isRead: {
    type: Boolean,
    default: false, 
  }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Temporary Route: শুধু একবার প্রথম অ্যাডমিন অ্যাকাউন্ট তৈরি করার জন্য (Postman থেকে কল করবেন)
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists!" });

    // পাসওয়ার্ড হ্যাশ করা হচ্ছে (যাতে ডেটাবেস হ্যাক হলেও পাসওয়ার্ড কেউ না বোঝে)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found!" });

    // পাসওয়ার্ড মেলানো হচ্ছে
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

    // JWT টোকেন জেনারেট করা হচ্ছে
    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: '1d', // টোকেনের মেয়াদ ১ দিন
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
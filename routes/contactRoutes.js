const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
// যদি অ্যাডমিন ভেরিফিকেশন মিডলওয়্যার থাকে (e.g., verifyJWT), তাহলে ইমপোর্ট করে নিবেন

// POST: নতুন কন্টাক্ট মেসেজ সেভ করার জন্য (পাবলিক)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    const newContact = new Contact({
      name,
      email,
      message
    });

    await newContact.save();
    res.status(201).json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET: অ্যাডমিন প্যানেলের জন্য সব মেসেজ দেখার API (সিকিউরড হওয়া উচিত)
router.get('/', async (req, res) => {
  try {
    // নতুন মেসেজগুলো আগে দেখানোর জন্য sort({ createdAt: -1 })
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH: মেসেজ 'Read' বা পড়া হয়েছে মার্ক করার জন্য
router.patch('/:id', async (req, res) => {
  try {
    const updatedMessage = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.status(200).json(updatedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST: Create a new contact message
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

// GET: Retrieve all contact messages
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH: Mark a contact message as read
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
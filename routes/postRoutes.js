const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET: সব পোস্ট দেখার জন্য (হোমপেজে শো করানোর জন্য)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // নতুন পোস্ট আগে দেখাবে
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: নতুন পোস্ট তৈরি করার জন্য (অ্যাডমিন প্যানেল থেকে)
router.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
const express = require('express')
const Category = require ('../models/Category.js')
const slugify = require('slugify')

const router = express.Router();

// 1. CREATE CATEGORY 
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const category = await Category.create({ name, slug, description });
    res.status(201).json({ message: 'Category created successfully', category });

  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. GET ALL CATEGORIES 
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. DELETE CATEGORY 
router.delete('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
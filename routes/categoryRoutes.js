import express from 'express';
import Category from '../models/Category.js'; // Model er path thik ache kina check kore niben
import slugify from 'slugify';

const router = express.Router();

// 1. CREATE CATEGORY (POST /api/categories)
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Name theke auto URL slug toiri kora (e.g., "Govt Jobs" -> "govt-jobs")
    const slug = slugify(name, { lower: true, strict: true });

    // Same category age theke ache kina check kora
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

// 2. GET ALL CATEGORIES (GET /api/categories)
router.get('/', async (req, res) => {
  try {
    // Shob category fetch kora (notun gula age asbe)
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. DELETE CATEGORY (DELETE /api/categories/:id)
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

export default router;
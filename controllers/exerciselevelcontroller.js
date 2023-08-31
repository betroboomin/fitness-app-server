const express = require('express');
const ExerciseLevel = require('../models/exerciselevel');
const mongoose = require('mongoose');
const ExerciseCategory = require('../models/exercisecategory')
const path = require('path');
const multer = require('multer');
const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}${ext}`);
    },
  });
  const upload = multer({ storage });
// Route to create an exercise level
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, categories } = req.body;
    console.log(req.body)
    console.log(req.file);
    const parsedCategories = JSON.parse(categories);

    const categoryIds = parsedCategories.map(categoryId => {
      if (mongoose.Types.ObjectId.isValid(categoryId)) {
        return new mongoose.Types.ObjectId(categoryId);
      } else {
        throw new Error('Invalid category ID: ' + categoryId);
      }
    });

    const foundCategories = await ExerciseCategory.find({ _id: { $in: categoryIds } });
    const categoryNames = foundCategories.map(category => category.name);

    const level = new ExerciseLevel({
      name,
      categories: categoryIds,
      imageUrl: `/uploads/${req.file.filename}`,
    });

    const savedLevel = await level.save();
    res.status(201).json({
      level: savedLevel,
      categoryNames,
    });
  } catch (error) {
    console.error('Error creating exercise level:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Level name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create exercise level' });
    }
  }
});

// Route to view all exercise levels
router.get('/', async (req, res) => {
  try {
    const levels = await ExerciseLevel.find().populate('categories');
    res.json(levels);
  } catch (error) {
    console.error('Error retrieving exercise levels:', error);
    res.status(500).json({ error: 'Failed to retrieve exercise levels' });
  }
});

// Route to view a particular exercise level
router.get('/:levelId', async (req, res) => {
  try {
    const levelId = req.params.levelId;
    const level = await ExerciseLevel.findById(levelId).populate('categories');

    if (!level) {
      return res.status(404).json({ error: 'Exercise level not found' });
    }

    
  } catch (error) {
    console.error('Error retrieving exercise level:', error);
    res.status(500).json({ error: 'Failed to retrieve exercise level' });
  }
});

// Route to update exercise levels
router.put('/:levelId', async (req, res) => {
  try {
    const levelId = req.params.levelId;
    const { name, categories } = req.body;

    const level = await ExerciseLevel.findById(levelId);

    if (!level) {
      return res.status(404).json({ error: 'Exercise level not found' });
    }

    level.name = name;
    level.categories = categories;

    const updatedLevel = await level.save();

    res.json(updatedLevel);
  } catch (error) {
    console.error('Error updating exercise level:', error);
    res.status(500).json({ error: 'Failed to update exercise level' });
  }
});

module.exports = router;

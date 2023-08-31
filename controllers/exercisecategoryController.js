const express = require('express');
const ExerciseCategory = require('../models/exercisecategory');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');


const router = express.Router();
const Exercise = require('../models/excerciseModel');


// // Route to create an exercise category
// router.post('/', async (req, res) => {
//     const { name, exercises } = req.body;  
// try {
//     // Create an array of exercise ObjectIds
//     const exerciseIds = exercises.map(exerciseId => mongoose.Types.ObjectId(exerciseId));

//     // Find the exercises based on the provided exerciseIds
//     const foundExercises = await Exercise.find({ _id: { $in: exerciseIds } });

//     // Create the exercise category and associate the found exercises
//     const category = new ExerciseCategory({
//       name,
//       exercises: foundExercises.map(exercise => exercise._id),
//     });

//     const savedCategory = await category.save();
//     res.status(201).json(savedCategory);
//   } catch (error) {
//     console.error('Error creating exercise category:', error);
//     res.status(500).json({ error: 'Failed to create exercise category' });
//   }
// });

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

// Route to create an exercise category
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log(req.file);
    const { name, exercises } = req.body;
    const parsedExercises = JSON.parse(exercises);

    const exerciseIds = parsedExercises.map(exerciseId => {
      if (mongoose.Types.ObjectId.isValid(exerciseId)) {
        return new mongoose.Types.ObjectId(exerciseId);
      } else {
        throw new Error('Invalid exercise ID: ' + exerciseId);
      }
    });

    const foundExercises = await Exercise.find({ _id: { $in: exerciseIds } });
    const exerciseID = foundExercises.map(exercise => exercise._id);
    const exerciseNames = foundExercises.map(exercise => exercise.name);

    const category = new ExerciseCategory({
      name: req.body.name,
      exercises: exerciseID,
      imageUrl: `/uploads/${req.file.filename}`,
    });

    const savedCategory = await category.save();
    console.log(category);
    res.status(201).json({
      category: savedCategory,
      exerciseNames: exerciseNames,
      
    });
  } catch (error) {
    console.error('Error creating exercise category:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Category name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create exercise category' });
    }
  }
});
// view all categories
router.get('/', async (req, res) => {
    try {
      const categories = await ExerciseCategory.find().populate('exercises');
      res.json(categories);
    } catch (error) {
      console.error('Error retrieving categories:', error);
      res.status(500).json({ error: 'Failed to retrieve categories' });
    }
  });
  



  //view a particular category
  router.get('/:categoryId', async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
      const category = await ExerciseCategory.findById(categoryId).populate('exercises');
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.json(category);
      console.log(category);
    } catch (error) {
      console.error('Error retrieving category:', error);
      res.status(500).json({ error: 'Failed to retrieve category' });
    }
  });
  

//update categories
  router.put('/:categoryId', async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
      const { name, exercises } = req.body;
      
      const category = await ExerciseCategory.findById(categoryId);
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      category.name = name;
      category.exercises = exercises;
      
      const updatedCategory = await category.save();
      
      res.json(updatedCategory);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Failed to update category' });
    }
  });
  

module.exports = router;

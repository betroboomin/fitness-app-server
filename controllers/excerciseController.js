const express = require('express');
const router = express.Router();
const Exercise = require('../models/excerciseModel');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
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

// Get all exercises
router.get('/', async (req, res) => {
  try {
    const exercises = await Exercise.find();
    const count = await Exercise.countDocuments({});
  console.log('Number of users:', count);

  const data = {
    exercises: exercises,
    count: count
  };
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single exercise
router.get('/:id',  async (req, res) => {
  
  try {
    const id = req.params.id;
    const level = await Exercise.findById(id);
    if (!level) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    res.json(level);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create an exercise
router.post('/',  upload.single('image'), async (req, res) => {
  const exercise = new Exercise({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    image:`/uploads/${req.file.filename}`,
    video: req.body.video,
    steps: req.body.steps,
    duration: req.body.duration,
    calories: req.body.calories
  });

  try {
    const newExercise = await exercise.save();
    res.status(201).json(newExercise);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an exercise
router.put('/:id', getExercise, async (req, res) => {
  if (req.body.name != null) {
    res.exercise.name = req.body.name;
  }
  if (req.body.description != null) {
    res.exercise.description = req.body.description;
  }
  if (req.body.category != null) {
    res.exercise.category = req.body.category;
  }
  if (req.body.image != null) {
    res.exercise.image = req.body.image;
  }
  if (req.body.video != null) {
    res.exercise.video = req.body.video;
  }
  if (req.body.steps != null) {
    res.exercise.steps = req.body.steps;
  }
  if (req.body.duration != null) {
    res.exercise.duration = req.body.duration;
  }
  if (req.body.calories != null) {
    res.exercise.calories = req.body.calories;
  }

  try {
    const updatedExercise = await res.exercise.save();
    res.json(updatedExercise);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an exercise
router.delete('/:id', getExercise, async (req, res) => {
  try {
    await Exercise.findByIdAndDelete();
    res.sendStatus(204);
    // res.json({ message: 'Exercise deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getExercise(req, res, next) {
  let exercise;
  try {
    exercise = await Exercise.findById(req.params.id);
    if (exercise == null) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    exercise.imageUrl = `http://localhost:3000/images/${exercise.image}`;
    exercise.videoUrl = `http://localhost:3000/videos/${exercise.video}`;
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.exercise = exercise;
  next();
}

module.exports = router;
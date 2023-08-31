const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  video: {
    type: String
  },
  steps: {
    type: [String],
  },
  duration: {
    type: Number,
    required: true
  },
  calories: {
    type: Number,
    required: true
  }
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = Exercise;
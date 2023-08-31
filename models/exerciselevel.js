const mongoose = require('mongoose');

const ExerciseLevelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExerciseCategory"
    }
  ],
  imageUrl: {
    type: String // Add any additional validation or default value if needed
  }
});

const ExerciseLevel = mongoose.model('ExerciseLevel', ExerciseLevelSchema);

module.exports = ExerciseLevel;

const mongoose = require('mongoose');

// Reference to the Exercise model
const Exercise = require('./excerciseModel');

const ExerciseCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    
  },
  exercises: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise"
    }
    
  ],
  imageUrl: {
    type: String // Add any additional validation or default value if needed
  }
});

const ExerciseCategory = mongoose.model('ExerciseCategory', ExerciseCategorySchema);
module.exports = ExerciseCategory;


// const ExerciseLevelSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   categories: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'ExerciseCategory',
//     },
//   ],
//   imageUrl: {
//     type: String // Add any additional validation or default value if needed
//   }
// });

// const ExerciseLevel = mongoose.model('ExerciseLevel', ExerciseLevelSchema);
// ExerciseCategory.createCollection().then(collection => {
//   collection.createIndex({ name: 1 }, { unique: true });
// });



// module.exports = { ExerciseCategory, 
//   // ExerciseLevel 
// };

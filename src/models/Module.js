const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Module course is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Module title is required'],
      trim: true,
      minlength: [3, 'Module title must be at least 3 characters'],
      maxlength: [150, 'Module title must be at most 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Module description must be at most 1000 characters'],
    },
    order: {
      type: Number,
      required: [true, 'Module order is required'],
      min: [1, 'Module order must be greater than or equal to 1'],
    },
  },
  { timestamps: true },
);

moduleSchema.index({ course: 1, order: 1 }, { unique: true });

module.exports = mongoose.model('Module', moduleSchema);

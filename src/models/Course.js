const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const STATUSES = ['draft', 'published', 'archived'];

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      minlength: [3, 'Course title must be at least 3 characters'],
      maxlength: [150, 'Course title must be at most 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      trim: true,
      maxlength: [2000, 'Course description must be at most 2000 characters'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Course category is required'],
    },
    level: {
      type: String,
      enum: { values: LEVELS, message: `Level must be one of: ${LEVELS.join(', ')}` },
      required: [true, 'Course level is required'],
    },
    tags: {
      type: [{ type: String, trim: true, lowercase: true }],
      default: [],
    },
    durationHours: {
      type: Number,
      min: [0, 'Duration must be positive'],
      default: 0,
    },
    trainer: {
      name: { type: String, trim: true, required: [true, 'Trainer name is required'] },
      email: { type: String, trim: true, lowercase: true },
    },
    status: {
      type: String,
      enum: { values: STATUSES, message: `Status must be one of: ${STATUSES.join(', ')}` },
      default: 'draft',
    },
    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

courseSchema.index({ status: 1, category: 1, level: 1 });

courseSchema.pre('validate', function setDerivedFields() {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title);
  }
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
module.exports.LEVELS = LEVELS;
module.exports.STATUSES = STATUSES;

const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'Category name must be at least 2 characters'],
      maxlength: [50, 'Category name must be at most 50 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Category description must be at most 300 characters'],
    },
  },
  { timestamps: true },
);

categorySchema.pre('validate', function setSlug() {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = slugify(this.name);
  }
});

module.exports = mongoose.model('Category', categorySchema);

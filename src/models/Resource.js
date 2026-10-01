const mongoose = require('mongoose');

const RESOURCE_TYPES = ['video', 'article', 'pdf', 'link'];

const resourceSchema = new mongoose.Schema(
  {
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: [true, 'Resource module is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
      minlength: [3, 'Resource title must be at least 3 characters'],
      maxlength: [150, 'Resource title must be at most 150 characters'],
    },
    type: {
      type: String,
      enum: {
        values: RESOURCE_TYPES,
        message: `Resource type must be one of: ${RESOURCE_TYPES.join(', ')}`,
      },
      required: [true, 'Resource type is required'],
    },
    url: {
      type: String,
      required: [true, 'Resource url is required'],
      trim: true,
      match: [/^https?:\/\/\S+$/, 'Resource url must be a valid http(s) URL'],
    },
    durationMinutes: {
      type: Number,
      min: [0, 'Duration must be positive'],
      default: 0,
    },
    order: {
      type: Number,
      required: [true, 'Resource order is required'],
      min: [1, 'Resource order must be greater than or equal to 1'],
    },
  },
  { timestamps: true },
);

resourceSchema.index({ module: 1, order: 1 }, { unique: true });

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
module.exports.RESOURCE_TYPES = RESOURCE_TYPES;

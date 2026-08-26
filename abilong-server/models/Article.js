const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    content:     { type: String, required: true },
    author:      { type: String, required: true },
    tag:         { type: String, default: 'General' },
    image:       { type: String, default: '' },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Article', articleSchema);

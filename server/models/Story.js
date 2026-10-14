const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorRole: {
    type: String,
    enum: ['volunteer', 'worker'],
    default: 'volunteer'
  },
  authorAvatar: {
    type: String,
    default: ''
  },
  organization: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: [true, 'Story title is required'],
    trim: true
  },
  story: {
    type: String,
    required: [true, 'Story narrative is required'],
    trim: true
  },
  keyImpact: {
    type: String,
    required: [true, 'Key impact metric is required'],
    trim: true
  },
  hoursServed: {
    type: Number,
    default: 0
  },
  cause: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: ''
  },
  inspires: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Story', storySchema);

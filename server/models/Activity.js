const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Activity title is required'],
    trim: true
  },
  organization: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true
  },
  date: {
    type: String,
    required: [true, 'Activity date is required']
  },
  hours: {
    type: Number,
    required: [true, 'Hours served is required'],
    min: [0.5, 'Hours must be at least 0.5']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  cause: {
    type: String,
    default: 'General'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);

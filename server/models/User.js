const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  role: {
    type: String,
    enum: ['volunteer', 'worker'],
    required: [true, 'Role is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  causes: {
    type: [String],
    default: []
  },
  availability: {
    type: String,
    enum: ['Weekdays', 'Weekends', 'Flexible', ''],
    default: 'Flexible'
  },
  organization: {
    type: String,
    default: ''
  },
  designation: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  banner: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  totalHours: {
    type: Number,
    default: 0
  },
  resetToken: {
    type: String,
    default: null
  },
  resetTokenExpires: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Remove password from JSON responses
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.resetToken;
  delete user.resetTokenExpires;
  return user;
};

module.exports = mongoose.model('User', userSchema);

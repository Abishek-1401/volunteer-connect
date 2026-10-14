const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Activity = require('../models/Activity');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { getMockActivities, setMockActivities, getMockUsers } = require('../services/mockStorage');

const syncUserHours = async (userId) => {
  if (mongoose.connection.readyState === 1) {
    const activities = await Activity.find({ user: userId });
    const totalHours = activities.reduce((sum, item) => sum + (Number(item.hours) || 0), 0);
    await User.findByIdAndUpdate(userId, { totalHours });
    return totalHours;
  } else {
    const activities = getMockActivities().filter(a => a.user.toString() === userId.toString());
    const totalHours = activities.reduce((sum, item) => sum + (Number(item.hours) || 0), 0);
    const user = getMockUsers().find(u => u._id.toString() === userId.toString());
    if (user) {
      user.totalHours = totalHours;
    }
    return totalHours;
  }
};

// @route   POST /api/activities
router.post('/', auth, async (req, res) => {
  try {
    const { title, organization, date, hours, description, cause } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Activity title is required.' });
    }
    if (!organization || !organization.trim()) {
      return res.status(400).json({ message: 'Organization name is required.' });
    }
    if (!date) {
      return res.status(400).json({ message: 'Activity date is required.' });
    }
    const numHours = parseFloat(hours);
    if (isNaN(numHours) || numHours <= 0) {
      return res.status(400).json({ message: 'Hours served must be a positive number.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Description is required.' });
    }

    let createdActivity;

    if (mongoose.connection.readyState === 1) {
      const activity = new Activity({
        user: req.userId,
        title: title.trim(),
        organization: organization.trim(),
        date,
        hours: numHours,
        description: description.trim(),
        cause: cause || 'General'
      });
      await activity.save();
      createdActivity = activity;
    } else {
      createdActivity = {
        _id: 'act_' + Date.now(),
        user: req.userId,
        title: title.trim(),
        organization: organization.trim(),
        date,
        hours: numHours,
        description: description.trim(),
        cause: cause || 'General',
        createdAt: new Date()
      };
      setMockActivities([createdActivity, ...getMockActivities()]);
    }

    const updatedTotalHours = await syncUserHours(req.userId);

    return res.status(201).json({
      message: 'Activity added successfully to your portfolio!',
      activity: createdActivity,
      totalHours: updatedTotalHours
    });
  } catch (err) {
    console.error('Create activity error:', err);
    return res.status(500).json({ message: 'Failed to add activity.' });
  }
});

// @route   PUT /api/activities/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, organization, date, hours, description, cause } = req.body;

    if (mongoose.connection.readyState === 1) {
      const activity = await Activity.findById(req.params.id);
      if (!activity) {
        return res.status(404).json({ message: 'Activity not found.' });
      }

      if (activity.user.toString() !== req.userId.toString()) {
        return res.status(403).json({ message: 'Not authorized to edit this activity.' });
      }

      if (title) activity.title = title.trim();
      if (organization) activity.organization = organization.trim();
      if (date) activity.date = date;
      if (hours !== undefined) activity.hours = parseFloat(hours) || activity.hours;
      if (description) activity.description = description.trim();
      if (cause) activity.cause = cause;

      await activity.save();
      const updatedTotalHours = await syncUserHours(req.userId);
      return res.json({ message: 'Activity updated successfully!', activity, totalHours: updatedTotalHours });
    } else {
      const activities = getMockActivities();
      const activity = activities.find(a => a._id.toString() === req.params.id.toString());
      if (!activity) {
        return res.status(404).json({ message: 'Activity not found.' });
      }

      if (activity.user.toString() !== req.userId.toString()) {
        return res.status(403).json({ message: 'Not authorized to edit this activity.' });
      }

      if (title) activity.title = title.trim();
      if (organization) activity.organization = organization.trim();
      if (date) activity.date = date;
      if (hours !== undefined) activity.hours = parseFloat(hours) || activity.hours;
      if (description) activity.description = description.trim();
      if (cause) activity.cause = cause;

      const updatedTotalHours = await syncUserHours(req.userId);
      return res.json({ message: 'Activity updated successfully!', activity, totalHours: updatedTotalHours });
    }
  } catch (err) {
    console.error('Update activity error:', err);
    return res.status(500).json({ message: 'Failed to update activity.' });
  }
});

// @route   DELETE /api/activities/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const activity = await Activity.findById(req.params.id);
      if (!activity) {
        return res.status(404).json({ message: 'Activity not found.' });
      }
      if (activity.user.toString() !== req.userId.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this activity.' });
      }
      await activity.deleteOne();
      const updatedTotalHours = await syncUserHours(req.userId);
      return res.json({ message: 'Activity removed.', totalHours: updatedTotalHours });
    } else {
      const activities = getMockActivities();
      const activity = activities.find(a => a._id.toString() === req.params.id.toString());
      if (!activity) {
        return res.status(404).json({ message: 'Activity not found.' });
      }
      if (activity.user.toString() !== req.userId.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this activity.' });
      }
      setMockActivities(activities.filter(a => a._id.toString() !== req.params.id.toString()));
      const updatedTotalHours = await syncUserHours(req.userId);
      return res.json({ message: 'Activity removed.', totalHours: updatedTotalHours });
    }
  } catch (err) {
    console.error('Delete activity error:', err);
    return res.status(500).json({ message: 'Failed to delete activity.' });
  }
});

module.exports = router;

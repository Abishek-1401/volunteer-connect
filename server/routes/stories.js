const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = require('../models/Story');
const auth = require('../middleware/auth');
const { getMockStories, setMockStories } = require('../services/mockStorage');

// @route   GET /api/stories
router.get('/', async (req, res) => {
  try {
    const { cause } = req.query;

    if (mongoose.connection.readyState === 1) {
      let filter = {};
      if (cause && cause !== 'All') {
        filter.cause = { $regex: new RegExp(`^${cause}$`, 'i') };
      }
      const stories = await Story.find(filter).sort({ createdAt: -1 }).limit(30);
      return res.json({ stories });
    } else {
      let stories = [...getMockStories()];
      if (cause && cause !== 'All') {
        stories = stories.filter(s => s.cause && s.cause.toLowerCase() === cause.toLowerCase());
      }
      return res.json({ stories });
    }
  } catch (err) {
    console.error('Get stories error:', err);
    return res.status(500).json({ message: 'Error retrieving impact stories.' });
  }
});

// @route   POST /api/stories
router.post('/', auth, async (req, res) => {
  try {
    const { title, story, keyImpact, hoursServed, cause, coverImage } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Story title is required.' });
    }
    if (!story || !story.trim()) {
      return res.status(400).json({ message: 'Impact story narrative is required.' });
    }
    if (!keyImpact || !keyImpact.trim()) {
      return res.status(400).json({ message: 'Key impact achievement metric is required.' });
    }
    if (!cause || !cause.trim()) {
      return res.status(400).json({ message: 'Cause category is required.' });
    }

    if (mongoose.connection.readyState === 1) {
      const newStory = new Story({
        author: req.userId,
        authorName: req.user.name,
        authorRole: req.user.role,
        authorAvatar: req.user.avatar || '',
        organization: req.user.organization || '',
        title: title.trim(),
        story: story.trim(),
        keyImpact: keyImpact.trim(),
        hoursServed: parseFloat(hoursServed) || 0,
        cause: cause.trim(),
        coverImage: coverImage ? coverImage.trim() : 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
        inspires: []
      });
      await newStory.save();
      return res.status(201).json({ message: 'Your impact story has been published to inspire others!', story: newStory });
    } else {
      const newStory = {
        _id: 'story_' + Date.now(),
        author: req.userId,
        authorName: req.user.name,
        authorRole: req.user.role,
        authorAvatar: req.user.avatar || '',
        organization: req.user.organization || '',
        title: title.trim(),
        story: story.trim(),
        keyImpact: keyImpact.trim(),
        hoursServed: parseFloat(hoursServed) || 0,
        cause: cause.trim(),
        coverImage: coverImage ? coverImage.trim() : 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
        inspires: [],
        createdAt: new Date()
      };
      setMockStories([newStory, ...getMockStories()]);
      return res.status(201).json({ message: 'Your impact story has been published to inspire others!', story: newStory });
    }
  } catch (err) {
    console.error('Create story error:', err);
    return res.status(500).json({ message: 'Failed to publish story.' });
  }
});

// @route   POST /api/stories/:id/inspire
router.post('/:id/inspire', auth, async (req, res) => {
  try {
    const userIdStr = req.userId.toString();

    if (mongoose.connection.readyState === 1) {
      const story = await Story.findById(req.params.id);
      if (!story) return res.status(404).json({ message: 'Impact story not found.' });

      const hasInspired = story.inspires.some(id => id.toString() === userIdStr);
      if (hasInspired) {
        story.inspires = story.inspires.filter(id => id.toString() !== userIdStr);
      } else {
        story.inspires.push(req.userId);
      }
      await story.save();
      return res.json({ inspiresCount: story.inspires.length, hasInspired: !hasInspired });
    } else {
      const stories = getMockStories();
      const story = stories.find(s => s._id.toString() === req.params.id.toString());
      if (!story) return res.status(404).json({ message: 'Impact story not found.' });

      const hasInspired = story.inspires.some(id => (typeof id === 'string' ? id : id._id) === userIdStr);
      if (hasInspired) {
        story.inspires = story.inspires.filter(id => (typeof id === 'string' ? id : id._id) !== userIdStr);
      } else {
        story.inspires.push(userIdStr);
      }
      return res.json({ inspiresCount: story.inspires.length, hasInspired: !hasInspired });
    }
  } catch (err) {
    console.error('Inspire toggle error:', err);
    return res.status(500).json({ message: 'Failed to update reaction.' });
  }
});

module.exports = router;

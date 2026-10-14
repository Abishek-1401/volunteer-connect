const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');
const { getMockUsers, getMockActivities, setMockUsers } = require('../services/mockStorage');

// @route   GET /api/users/explore
router.get('/explore', async (req, res) => {
  try {
    const { search, cause, location, role } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (role && ['volunteer', 'worker'].includes(role)) {
        query.role = role;
      }
      if (cause && cause !== 'All') {
        query.causes = { $regex: new RegExp(`^${cause}$`, 'i') };
      }
      if (location && location.trim()) {
        query.location = { $regex: location.trim(), $options: 'i' };
      }
      if (search && search.trim()) {
        const searchRegex = { $regex: search.trim(), $options: 'i' };
        query.$or = [
          { name: searchRegex },
          { location: searchRegex },
          { organization: searchRegex },
          { skills: searchRegex },
          { causes: searchRegex },
          { bio: searchRegex }
        ];
      }

      const users = await User.find(query).sort({ totalHours: -1, createdAt: -1 }).limit(60);
      return res.json({ users });
    } else {
      let filtered = [...getMockUsers()];
      if (role && ['volunteer', 'worker'].includes(role)) {
        filtered = filtered.filter(u => u.role === role);
      }
      if (cause && cause !== 'All') {
        filtered = filtered.filter(u => u.causes && u.causes.some(c => c.toLowerCase() === cause.toLowerCase()));
      }
      if (location && location.trim()) {
        const locLower = location.trim().toLowerCase();
        filtered = filtered.filter(u => u.location && u.location.toLowerCase().includes(locLower));
      }
      if (search && search.trim()) {
        const sLower = search.trim().toLowerCase();
        filtered = filtered.filter(u =>
          (u.name && u.name.toLowerCase().includes(sLower)) ||
          (u.location && u.location.toLowerCase().includes(sLower)) ||
          (u.organization && u.organization.toLowerCase().includes(sLower)) ||
          (u.bio && u.bio.toLowerCase().includes(sLower)) ||
          (u.skills && u.skills.some(sk => sk.toLowerCase().includes(sLower))) ||
          (u.causes && u.causes.some(cs => cs.toLowerCase().includes(sLower)))
        );
      }

      const safeUsers = filtered.map(u => {
        const copy = { ...u };
        delete copy.password;
        return copy;
      });
      return res.json({ users: safeUsers });
    }
  } catch (err) {
    console.error('Explore error:', err);
    return res.status(500).json({ message: 'Error retrieving volunteers.' });
  }
});

// @route   GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const activities = await Activity.find({ user: user._id }).sort({ date: -1, createdAt: -1 });
      const calculatedHours = activities.reduce((acc, act) => acc + (Number(act.hours) || 0), 0);
      if (user.totalHours !== calculatedHours) {
        user.totalHours = calculatedHours;
        await user.save();
      }

      return res.json({ user, activities });
    } else {
      const user = getMockUsers().find(u => u._id.toString() === userId.toString());
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const activities = getMockActivities().filter(a => a.user.toString() === userId.toString());
      const safeUser = { ...user };
      delete safeUser.password;
      return res.json({ user: safeUser, activities });
    }
  } catch (err) {
    console.error('User profile error:', err);
    return res.status(500).json({ message: 'Error loading user profile.' });
  }
});

// @route   PUT /api/users/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      name,
      bio,
      avatar,
      banner,
      location,
      skills,
      causes,
      availability,
      organization,
      designation,
      website
    } = req.body;

    if (mongoose.connection.readyState === 1) {
      const user = req.user;
      if (name && name.trim()) user.name = name.trim();
      if (typeof bio === 'string') user.bio = bio.trim();
      if (avatar) user.avatar = avatar.trim();
      if (banner) user.banner = banner.trim();
      if (location && location.trim()) user.location = location.trim();
      if (Array.isArray(skills)) user.skills = skills.map(s => s.trim()).filter(Boolean);
      if (Array.isArray(causes)) user.causes = causes.map(c => c.trim()).filter(Boolean);

      if (user.role === 'volunteer') {
        if (availability) user.availability = availability;
      } else if (user.role === 'worker') {
        if (organization) user.organization = organization.trim();
        if (designation) user.designation = designation.trim();
        if (typeof website === 'string') user.website = website.trim();
      }

      await user.save();
      return res.json({ message: 'Profile updated successfully!', user });
    } else {
      const user = req.user;
      if (name && name.trim()) user.name = name.trim();
      if (typeof bio === 'string') user.bio = bio.trim();
      if (avatar) user.avatar = avatar.trim();
      if (banner) user.banner = banner.trim();
      if (location && location.trim()) user.location = location.trim();
      if (Array.isArray(skills)) user.skills = skills.map(s => s.trim()).filter(Boolean);
      if (Array.isArray(causes)) user.causes = causes.map(c => c.trim()).filter(Boolean);

      if (user.role === 'volunteer') {
        if (availability) user.availability = availability;
      } else if (user.role === 'worker') {
        if (organization) user.organization = organization.trim();
        if (designation) user.designation = designation.trim();
        if (typeof website === 'string') user.website = website.trim();
      }

      const safeUser = { ...user };
      delete safeUser.password;
      return res.json({ message: 'Profile updated successfully!', user: safeUser });
    }
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ message: 'Error updating profile.' });
  }
});

// @route   PUT /api/users/change-password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required.' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long.' });
    }

    if (mongoose.connection.readyState === 1) {
      const userWithPassword = await User.findById(req.userId);
      const isMatch = await bcrypt.compare(currentPassword, userWithPassword.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password.' });
      }

      const salt = await bcrypt.genSalt(10);
      userWithPassword.password = await bcrypt.hash(newPassword, salt);
      await userWithPassword.save();
    } else {
      const user = req.user;
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password.' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    return res.json({ message: 'Password updated successfully!' });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating password.' });
  }
});

module.exports = router;

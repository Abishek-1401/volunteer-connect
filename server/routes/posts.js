const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const { getMockPosts, setMockPosts, getMockUsers } = require('../services/mockStorage');

// @route   GET /api/posts
router.get('/', async (req, res) => {
  try {
    const { cause } = req.query;

    if (mongoose.connection.readyState === 1) {
      let filter = {};
      if (cause && cause !== 'All') {
        filter.cause = { $regex: new RegExp(`^${cause}$`, 'i') };
      }
      const posts = await Post.find(filter)
        .populate('author', 'name avatar role location organization designation totalHours')
        .sort({ createdAt: -1 })
        .limit(50);
      return res.json({ posts });
    } else {
      let posts = [...getMockPosts()];
      if (cause && cause !== 'All') {
        posts = posts.filter(p => p.cause && p.cause.toLowerCase() === cause.toLowerCase());
      }
      return res.json({ posts });
    }
  } catch (err) {
    console.error('Get posts error:', err);
    return res.status(500).json({ message: 'Error retrieving community feed.' });
  }
});

// @route   POST /api/posts
router.post('/', auth, async (req, res) => {
  try {
    const { content, image, cause } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Post content cannot be empty.' });
    }

    if (mongoose.connection.readyState === 1) {
      const post = new Post({
        author: req.userId,
        content: content.trim(),
        image: image ? image.trim() : '',
        cause: cause || 'General',
        likes: [],
        comments: []
      });
      await post.save();
      await post.populate('author', 'name avatar role location organization designation totalHours');
      return res.status(201).json({ message: 'Post shared to community feed!', post });
    } else {
      const user = getMockUsers().find(u => u._id.toString() === req.userId.toString()) || req.user;
      const newPost = {
        _id: 'post_' + Date.now(),
        author: {
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          location: user.location,
          organization: user.organization,
          designation: user.designation,
          totalHours: user.totalHours || 0
        },
        content: content.trim(),
        image: image ? image.trim() : '',
        cause: cause || 'General',
        likes: [],
        comments: [],
        createdAt: new Date()
      };
      setMockPosts([newPost, ...getMockPosts()]);
      return res.status(201).json({ message: 'Post shared to community feed!', post: newPost });
    }
  } catch (err) {
    console.error('Create post error:', err);
    return res.status(500).json({ message: 'Failed to create post.' });
  }
});

// @route   POST /api/posts/:id/like
router.post('/:id/like', auth, async (req, res) => {
  try {
    const userIdStr = req.userId.toString();

    if (mongoose.connection.readyState === 1) {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found.' });

      const isLiked = post.likes.some(id => id.toString() === userIdStr);
      if (isLiked) {
        post.likes = post.likes.filter(id => id.toString() !== userIdStr);
      } else {
        post.likes.push(req.userId);
      }
      await post.save();
      return res.json({ likesCount: post.likes.length, isLiked: !isLiked });
    } else {
      const posts = getMockPosts();
      const post = posts.find(p => p._id.toString() === req.params.id.toString());
      if (!post) return res.status(404).json({ message: 'Post not found.' });

      const isLiked = post.likes.some(id => (typeof id === 'string' ? id : id._id) === userIdStr);
      if (isLiked) {
        post.likes = post.likes.filter(id => (typeof id === 'string' ? id : id._id) !== userIdStr);
      } else {
        post.likes.push(userIdStr);
      }
      return res.json({ likesCount: post.likes.length, isLiked: !isLiked });
    }
  } catch (err) {
    console.error('Like error:', err);
    return res.status(500).json({ message: 'Failed to update like.' });
  }
});

// @route   POST /api/posts/:id/comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text cannot be empty.' });
    }

    const newComment = {
      user: req.userId,
      userName: req.user.name,
      userAvatar: req.user.avatar || '',
      text: text.trim(),
      createdAt: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found.' });
      post.comments.unshift(newComment);
      await post.save();
      return res.status(201).json({ message: 'Comment added.', comments: post.comments });
    } else {
      const posts = getMockPosts();
      const post = posts.find(p => p._id.toString() === req.params.id.toString());
      if (!post) return res.status(404).json({ message: 'Post not found.' });
      post.comments.unshift(newComment);
      return res.status(201).json({ message: 'Comment added.', comments: post.comments });
    }
  } catch (err) {
    console.error('Comment error:', err);
    return res.status(500).json({ message: 'Failed to add comment.' });
  }
});

// @route   DELETE /api/posts/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found.' });
      if (post.author.toString() !== req.userId.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this post.' });
      }
      await post.deleteOne();
      return res.json({ message: 'Post deleted successfully.' });
    } else {
      const posts = getMockPosts();
      const post = posts.find(p => p._id.toString() === req.params.id.toString());
      if (!post) return res.status(404).json({ message: 'Post not found.' });
      setMockPosts(posts.filter(p => p._id.toString() !== req.params.id.toString()));
      return res.json({ message: 'Post deleted successfully.' });
    }
  } catch (err) {
    console.error('Delete post error:', err);
    return res.status(500).json({ message: 'Failed to delete post.' });
  }
});

module.exports = router;

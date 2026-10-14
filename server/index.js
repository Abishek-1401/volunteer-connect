require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const activityRoutes = require('./routes/activities');
const postRoutes = require('./routes/posts');
const storyRoutes = require('./routes/stories');
const seedInitialData = require('./seed/seedData');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'MongoDB (Connected)' : 'In-Memory Store (Active Fallback)';
  res.json({
    status: 'ok',
    message: 'VolunteerConnect API is running smoothly',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/stories', storyRoutes);

// Global 404 handler for API routes
app.use((req, res, next) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.url}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/volunteer_connect';

console.log(`Connecting to MongoDB at: ${mongoUri.includes('@') ? mongoUri.replace(/:([^:@]+)@/, ':****@') : mongoUri}`);

mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 2000
})
.then(async () => {
  console.log('✅ MongoDB connected successfully!');
  await seedInitialData();
})
.catch((err) => {
  console.warn('⚠️ MongoDB connection note:', err.message);
  console.log('💡 VolunteerConnect is running with active fallback data so everything works seamlessly!');
  console.log('👉 To connect MongoDB Atlas, update MONGODB_URI in server/.env with your MongoDB Atlas cluster URI.');
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 VolunteerConnect Backend Server running on port ${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
});

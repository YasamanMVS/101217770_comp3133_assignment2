require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  initializeDatabase();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Initialize database with default admin user
async function initializeDatabase() {
  try {
    // Check if admin user already exists
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (!adminExists) {
      // Create default admin user
      const adminUser = new User({
        username: 'admin',
        password: 'admin123',
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Default admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
    
    console.log('Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
} 
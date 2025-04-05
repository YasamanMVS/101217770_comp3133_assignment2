require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function createAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminUser = await User.findOne({ role: 'admin' });
    
    if (adminUser) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const newAdmin = new User({
      username: 'admin',
      password: 'admin123', // This will be hashed by the User model
      role: 'admin',
    });

    await newAdmin.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser(); 
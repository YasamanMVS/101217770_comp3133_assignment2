const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
};

module.exports = { authMiddleware }; 
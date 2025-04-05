const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  department: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// Index for search functionality
employeeSchema.index({ department: 1, position: 1 });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee; 
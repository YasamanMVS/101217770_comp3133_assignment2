const User = require('../models/User');
const Employee = require('../models/Employee');
const { generateToken } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const resolvers = {
  Query: {
    // Get current user
    me: async (_, __, { token }) => {
      try {
        if (!token) {
          throw new Error('Not authenticated');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
          throw new Error('User not found');
        }
        
        return user;
      } catch (error) {
        console.error('Error in me query:', error);
        throw new Error('Authentication error');
      }
    },
    
    // Get all employees
    employees: async () => {
      try {
        return await Employee.find();
      } catch (error) {
        throw new Error(`Error fetching employees: ${error.message}`);
      }
    },
    
    // Get employee by ID
    employee: async (_, { id }) => {
      try {
        return await Employee.findById(id);
      } catch (error) {
        throw new Error(`Error fetching employee: ${error.message}`);
      }
    },
    
    // Search employees by department or position
    searchEmployees: async (_, { department, position }, { token }) => {
      try {
        if (!token) {
          throw new Error('Not authenticated');
        }
        
        const query = {};
        if (department) query.department = department;
        if (position) query.position = position;
        
        return await Employee.find(query).sort({ createdAt: -1 });
      } catch (error) {
        console.error('Error in searchEmployees query:', error);
        throw new Error('Error searching employees');
      }
    }
  },
  
  Mutation: {
    // Login user
    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('Invalid email or password');
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          throw new Error('Invalid email or password');
        }
        
        const token = generateToken(user);
        
        return {
          token,
          user: {
            id: user._id,
            email: user.email,
            role: user.role
          }
        };
      } catch (error) {
        console.error('Login error:', error);
        throw new Error(error.message || 'Login failed');
      }
    },
    
    // Create employee
    createEmployee: async (_, { firstName, lastName, email, department, position, profilePic }) => {
      try {
        const employee = new Employee({
          firstName,
          lastName,
          email,
          department,
          position,
          profilePic
        });

        await employee.save();
        return employee;
      } catch (error) {
        throw new Error(`Error creating employee: ${error.message}`);
      }
    },
    
    // Update employee
    updateEmployee: async (_, { id, firstName, lastName, email, department, position, profilePic }) => {
      try {
        const updateData = {
          firstName,
          lastName,
          email,
          department,
          position,
          ...(profilePic !== undefined && { profilePic })
        };

        const employee = await Employee.findByIdAndUpdate(
          id,
          updateData,
          { new: true }
        );

        if (!employee) {
          throw new Error('Employee not found');
        }

        return employee;
      } catch (error) {
        throw new Error(`Error updating employee: ${error.message}`);
      }
    },
    
    // Delete employee
    deleteEmployee: async (_, { id }) => {
      try {
        // Delete profile picture if it exists
        const employee = await Employee.findById(id);
        if (employee?.profilePic) {
          const filePath = path.join(__dirname, '../..', employee.profilePic);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }

        const result = await Employee.findByIdAndDelete(id);
        return !!result;
      } catch (error) {
        throw new Error(`Error deleting employee: ${error.message}`);
      }
    }
  }
};

module.exports = resolvers; 
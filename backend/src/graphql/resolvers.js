const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');
const { upload } = require('../config/s3');

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return user;
    },
    employees: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return Employee.find();
    },
    employee: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return Employee.findById(id);
    },
    searchEmployees: async (_, { department, position }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const query = {};
      if (department) query.department = department;
      if (position) query.position = position;
      return Employee.find(query);
    },
  },
  Mutation: {
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('User not found');

      const isValid = await user.comparePassword(password);
      if (!isValid) throw new Error('Invalid password');

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return {
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
      };
    },
    createEmployee: async (_, args, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const employee = new Employee(args);
      await employee.save();
      return employee;
    },
    updateEmployee: async (_, { id, ...updates }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const employee = await Employee.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true }
      );
      if (!employee) throw new Error('Employee not found');
      return employee;
    },
    deleteEmployee: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const employee = await Employee.findByIdAndDelete(id);
      if (!employee) throw new Error('Employee not found');
      return true;
    },
  },
};

module.exports = resolvers; 
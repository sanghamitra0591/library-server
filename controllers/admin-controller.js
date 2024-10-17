const { UserModel } = require("../models/user-model");
const bcrypt = require('bcrypt');
const validator = require('validator');

const addAdmin = async (req, res) => {
  try {
    const { username, password, category, email } = req.body;

    if (!username || !password || !category || !email) {
      return res.status(400).json({ message: 'Username, password, email and category are required.' });
    }

    if (typeof username !== 'string' || username.trim().length === 0) {
      return res.status(400).json({ message: 'Username must be a non-empty string.' });
    }

    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ message: 'Username must be between 3 and 30 characters.' });
    }

    if (!validator.isAlphanumeric(username)) {
      return res.status(400).json({ message: 'Username must be alphanumeric.' });
    }

    if (typeof category !== 'string' || category.trim().length === 0) {
      return res.status(400).json({ message: 'Category must be a non-empty string.' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      return res.status(400).json({ message: 'Password must include uppercase, lowercase, numbers, and special characters.' });
    }

    const existingUser = await UserModel.findOne({ username });
    const existingCategory = await UserModel.findOne({ category });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new UserModel({ username, password: hashedPassword, role: 'admin', category, email });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAdmins = async (req, res) => {
  try {
      const admins = await UserModel.find({ role: 'admin' }).select('-password');
      res.json(admins);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

module.exports = { addAdmin, getAllUsers, getAllAdmins };


module.exports = { addAdmin, getAllUsers, getAllAdmins };
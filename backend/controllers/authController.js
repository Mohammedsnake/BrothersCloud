const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  const { first_name, middle_name, last_name, password } = req.body;

  if (!first_name || !last_name || !password)
    return res.status(400).json({ message: 'first_name, last_name, and password required' });

  try {
    const user = await UserModel.findByName(first_name, middle_name, last_name);
    if (!user) return res.status(400).json({ message: 'User not found' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { user_id: user.user_id, first_name: user.first_name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        middle_name: user.middle_name,
        last_name: user.last_name,
      },
      token,
      message: 'Login successful',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  const { first_name, middle_name, last_name, password } = req.body;
  if (!first_name || !last_name || !password)
    return res.status(400).json({ message: 'first_name, last_name, and password required' });

  try {
    const userExists = await UserModel.findByName(first_name, middle_name, last_name);
    if (userExists) return res.status(409).json({ message: 'User already exists' });

    const id = await UserModel.create({ first_name, middle_name, last_name, password });
    res.status(201).json({ message: 'User registered', user_id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

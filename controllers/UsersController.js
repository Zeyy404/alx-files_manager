const crypto = require('crypto');
const User = require('../models/User');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exists' });
    }

    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    try {
      await newUser.save();
      res.status(201).json({ id: newUser._id, email: newUser.email });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = UsersController;

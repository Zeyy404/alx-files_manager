/* eslint-disable */
const crypto = require('crypto');
const User = require('../models/User');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    try {
      const newUser = await UserModel.create(email, password);
      res.status(201).json({ id: newUser.id, email: newUser.email });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('email _id');
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.status(200).json({ id: user._id, email: user.email });
  }
}

module.exports = UsersController;

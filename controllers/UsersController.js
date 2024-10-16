/* eslint-disable */
const crypto = require('crypto');
const UserModel = require('../models/User');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Already exists' });
      }

      const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

      const newUser = { email, password: hashedPassword };
      const result = await UserModel.create(newUser);
      return res.status(201).json({ id: result.insertedId, email: result.email });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.status(200).json({ id: user._id, email: user.email });
  }
}

module.exports = UsersController;

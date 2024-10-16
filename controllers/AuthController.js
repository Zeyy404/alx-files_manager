/* eslint-disable */
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('../models/User');
const redisClient = require('../utils/redisClient');

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [email, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    const user = await UserModel.findByEmail(email);
    if (!user || user.password !== hashedPassword) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    const key = `auth_${token}`;

    await redisClient.setex(key, 24 * 60 * 60, user._id.toString());

    res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await redisClient.del(key);
    res.status(204).send();
  }
}

module.exports = AuthController;

const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  static async getStatus(req, res) {
    try {
      const status = {
        redis: redisClient.isAlive(),
        db: dbClient.isAlive(),
      };
      res.status(200).json(status);
    } catch (error) {
      console.error('Error checking status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getStats(req, res) {
    try {
      const [userCount, fileCount] = await Promise.all([
        dbClient.nbUsers(),
        dbClient.nbFiles(),
      ]);

      const stats = {
        users: userCount,
        files: fileCount,
      };
      res.status(200).json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = AppController;

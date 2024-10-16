/* eslint-disable */
const dbClient = require('../utils/db');

class User {
  static async findByEmail(email) {
    const db = dbClient.client.db(dbClient.databaseName);
    const usersCollection = db.collection('users');
    return await usersCollection.findOne({ email });
  }

  static async create(user) {
    const db = dbClient.client.db(dbClient.databaseName);
    const usersCollection = db.collection('users');
    const result = await usersCollection.insertOne(user);
    return { insertedId: result.insertedId, email: user.email };
  }
}

module.exports = User;

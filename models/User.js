/* eslint-disable */
const dbClient = require('../utils/db');
const { ObjectId } = require('mongodb');
const crypto = require('crypto');

class UserModel {
  constructor() {
    this.collection = dbClient.client.db(dbClient.databaseName).collection('users');
  }

  async create(email, password) {
    // Validate email and password
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Check if the user already exists
    const existingUser = await this.collection.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash the password
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    // Create the new user document
    const user = { email, password: hashedPassword };
    const result = await this.collection.insertOne(user);
    return { id: result.insertedId, email: user.email };
  }

  async findById(id) {
    return await this.collection.findOne({ _id: ObjectId(id) });
  }

  async findByEmail(email) {
    return await this.collection.findOne({ email });
  }
}

module.exports = new UserModel();

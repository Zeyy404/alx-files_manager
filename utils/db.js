const mongoose = require('mongoose');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    this.uri = `mongodb://${host}:${port}/${database}`;
    this.isConnected = false;

    this.connect();
  }

  async connect() {
    try {
      await mongoose.connect(this.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      this.isConnected = true;
      console.log(`Connected to MongoDB at ${this.uri}`);
    } catch (err) {
      console.error('MongoDB Connection Error:', err);
      this.isConnected = false;
    }
  }

  isAlive() {
    return this.isConnected;
  }

  async nbUsers() {
    if (!this.isConnected) return 0;

    const User = mongoose.model('User');
    const count = await User.countDocuments();
    return count;
  }

  async nbFiles() {
    if (!this.isConnected) return 0;

    const File = mongoose.model('File');
    const count = await File.countDocuments();
    return count;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;

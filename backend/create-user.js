// create-user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const User = require('./models/User');

async function createUser(username, plainPassword) {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existing = await User.findOne({ username });
    if (existing) {
      console.log(`❌ User "${username}" already exists.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    console.log(`✅ User "${username}" created successfully.`);
  } catch (err) {
    console.error('❌ Error creating user:', err);
  } finally {
    mongoose.connection.close();
  }
}

// Read from command line args: node create-user.js username password
const [username, password] = process.argv.slice(2);
if (!username || !password) {
  console.log('Usage: node create-user.js <username> <password>');
  process.exit(1);
}

createUser(username, password);

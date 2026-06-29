const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function createAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Error: MONGODB_URI is not set in .env.local');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected!');

  const email = 'admin@pu-incent.com';
  const password = 'admin';

  // Check if user already exists
  const existing = await mongoose.connection.collection('users').findOne({ email });
  if (existing) {
    console.log(`Admin user ${email} already exists!`);
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const adminUser = {
    email,
    passwordHash,
    role: 'admin',
    permissions: {
      canView: true,
      canEdit: true,
      canAdd: true,
      accessibleStartups: 'ALL'
    },
    createdAt: new Date()
  };

  await mongoose.connection.collection('users').insertOne(adminUser);
  console.log(`\n✅ Success! Admin user created.`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`\nYou can now log in at http://localhost:3000/login`);
  
  process.exit(0);
}

createAdmin();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await mongoose.connection.collection('users').findOne({ email: 'admin@pu-incent.com' });
  if (!user) {
    console.log('User not found!');
    process.exit(1);
  }
  console.log('User found:', user);
  const isValid = await bcrypt.compare('admin', user.passwordHash);
  console.log('Password valid?', isValid);
  process.exit(0);
}
test();

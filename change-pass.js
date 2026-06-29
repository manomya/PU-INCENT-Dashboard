const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function updatePassword() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('1234567890', salt);
  
  await mongoose.connection.collection('users').updateOne(
    { email: 'admin@pu-incent.com' },
    { $set: { passwordHash } }
  );
  
  console.log('Password updated successfully!');
  process.exit(0);
}
updatePassword();

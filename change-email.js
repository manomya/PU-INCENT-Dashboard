const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function updateEmailAndPassword() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('1234567890', salt);
  
  // First, see if they already created admin@puincent.com
  const existingNewEmail = await mongoose.connection.collection('users').findOne({ email: 'admin@puincent.com' });
  
  if (existingNewEmail) {
    // If it exists, just update its password
    await mongoose.connection.collection('users').updateOne(
      { email: 'admin@puincent.com' },
      { $set: { passwordHash, role: 'admin' } }
    );
    console.log('Updated existing admin@puincent.com with new password');
  } else {
    // If not, rename the old one (admin@pu-incent.com) to the new email and update password
    const result = await mongoose.connection.collection('users').updateOne(
      { email: 'admin@pu-incent.com' },
      { $set: { email: 'admin@puincent.com', passwordHash } }
    );
    
    if (result.matchedCount === 0) {
      // Neither existed? Just create it.
      await mongoose.connection.collection('users').insertOne({
        email: 'admin@puincent.com',
        passwordHash,
        role: 'admin',
        permissions: { canView: true, canEdit: true, canAdd: true, accessibleStartups: 'ALL' },
        createdAt: new Date()
      });
      console.log('Created new admin@puincent.com');
    } else {
      console.log('Renamed old admin to admin@puincent.com and updated password');
    }
  }
  
  process.exit(0);
}
updateEmailAndPassword();

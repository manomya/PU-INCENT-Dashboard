const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("Successfully connected to MongoDB");
    const count = await mongoose.connection.collection('users').countDocuments();
    console.log("Total users:", count);
    process.exit(0);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
}
test();

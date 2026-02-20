const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const collection = db.collection("users");

    console.log("Dropping old email_1 index if exists...");
    try {
      await collection.dropIndex("email_1");
      console.log("Dropped email_1 index");
    } catch (err) {
      console.log("email_1 index not found or already dropped");
    }

    console.log("Removing users with null/empty email_id...");
    const deleteResult = await collection.deleteMany({
      $or: [{ email_id: { $exists: false } }, { email_id: null }, { email_id: "" }]
    });
    console.log("Deleted users:", deleteResult.deletedCount);

    console.log("Ensuring unique index on email_id...");
    await collection.createIndex({ email_id: 1 }, { unique: true });
    console.log("Unique index on email_id ensured");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run();


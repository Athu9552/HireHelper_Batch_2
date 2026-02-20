const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const collection = db.collection("users");

    console.log("Dropping old email_1 index if it exists...");
    try {
      await collection.dropIndex("email_1");
      console.log("Dropped email_1 index");
    } catch (err) {
      console.log("email_1 index not found or already dropped");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run();


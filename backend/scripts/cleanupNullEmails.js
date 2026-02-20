const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await User.deleteMany({
      $or: [{ email_id: { $exists: false } }, { email_id: null }, { email_id: "" }]
    });
    console.log("Deleted users:", result.deletedCount);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run();


const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  phone_number: String,
  email_id: { type: String, unique: true },
  password: String,
  profile_picture: String,
  otp: String,
  isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", UserSchema);

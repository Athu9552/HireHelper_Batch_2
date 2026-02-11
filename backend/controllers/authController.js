const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const sendEmail = require("../utils/emailService");

exports.register = async (req, res) => {
  const { first_name, last_name, email_id, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = otpGenerator.generate(6, { digits: true, alphabets: false });

  const user = new User({
    first_name,
    last_name,
    email_id,
    password: hashedPassword,
    otp
  });

  await user.save();
  await sendEmail(email_id, "Your OTP", `Your OTP is ${otp}`);

  res.json({ message: "Registered! Check email for OTP" });
};

exports.verifyOTP = async (req, res) => {
  const { email_id, otp } = req.body;

  const user = await User.findOne({ email_id });

  if (!user || user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.isVerified = true;
  user.otp = null;
  await user.save();

  res.json({ message: "Email verified successfully!" });
};

exports.login = async (req, res) => {
  const { email_id, password } = req.body;

  const user = await User.findOne({ email_id });

  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  if (!user.isVerified)
    return res.status(400).json({ message: "Verify email first" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });

  res.json({ token });
};

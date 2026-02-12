const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const sendEmail = require("../utils/emailService");

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email_id, password } = req.body;

    const existingUser = await User.findOne({ email_id });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email_id, otp } = req.body;

    const user = await User.findOne({ email_id });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    res.json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

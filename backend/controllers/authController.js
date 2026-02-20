const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const sendEmail = require("../utils/emailService");
const mongoose = require("mongoose");

const isDbConnected = () =>
  mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2;

exports.register = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res
        .status(503)
        .json({ message: "Database not connected. Please try again shortly." });
    }

    let { first_name, last_name, email_id, password } = req.body;

    if (!first_name || !last_name || !email_id || !password) {
      return res
        .status(400)
        .json({ message: "First name, last name, email and password are required" });
    }

    email_id = String(email_id).trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_id)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({
      email_id: { $regex: new RegExp(`^${email_id}$`, "i") }
    });

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
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }
    res.status(500).json({ message: error.message || "Registration failed" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res
        .status(503)
        .json({ message: "Database not connected. Please try again shortly." });
    }

    let { email_id, otp } = req.body;
    if (!email_id || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    email_id = String(email_id).trim().toLowerCase();

    const user = await User.findOne({ email_id });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    res.json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message || "OTP verification failed" });
  }
};

exports.login = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res
        .status(503)
        .json({ message: "Database not connected. Please try again shortly." });
    }

    let { email_id, password } = req.body;

    if (!email_id || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    email_id = String(email_id).trim().toLowerCase();

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
    res.status(500).json({ message: error.message || "Login failed" });
  }
};

exports.getMe = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res
        .status(503)
        .json({ message: "Database not connected. Please try again shortly." });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch user" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res
        .status(503)
        .json({ message: "Database not connected. Please try again shortly." });
    }

    let { email_id } = req.body;
    if (!email_id) {
      return res.status(400).json({ message: "Email is required" });
    }
    email_id = String(email_id).trim().toLowerCase();

    const user = await User.findOne({ email_id });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const resetOtp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false
    });
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    user.resetOtp = resetOtp;
    user.resetOtpExpires = expires;
    await user.save();

    await sendEmail(
      email_id,
      "Password Reset Code",
      `Your password reset code is ${resetOtp}. It will expire in 15 minutes.`
    );

    res.json({ message: "Reset code sent to your email" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to start password reset" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res
        .status(503)
        .json({ message: "Database not connected. Please try again shortly." });
    }

    let { email_id, otp, newPassword } = req.body;

    if (!email_id || !otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, OTP and new password are required" });
    }

    email_id = String(email_id).trim().toLowerCase();

    const user = await User.findOne({ email_id });
    if (!user || !user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({ message: "No reset request found" });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.resetOtpExpires < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpires = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to reset password" });
  }
};


const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hirehelper_profiles",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

const upload = multer({ storage });

router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOTP);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/me", auth, authController.getMe);
router.post("/upload-profile-picture", auth, upload.single("profile_picture"), authController.uploadProfilePicture);
router.delete("/remove-profile-picture", auth, authController.removeProfilePicture);
router.put("/update-profile", auth, authController.updateProfile);
router.put("/change-password", auth, authController.changePassword);

module.exports = router;

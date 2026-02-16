const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOTP);
router.post("/login", authController.login);
const auth = require("../middleware/auth");
router.get("/me", auth, authController.getMe);


module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const notificationController = require("../controllers/notificationController");

router.get("/", auth, notificationController.getNotifications);
router.get("/unread-count", auth, notificationController.getUnreadCount);
router.put("/read", auth, notificationController.markAsRead);
router.put("/read-all", auth, notificationController.markAllAsRead);

module.exports = router;


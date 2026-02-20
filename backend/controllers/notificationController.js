const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Failed to fetch notifications" });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      read: false
    });
    res.json({ count });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Failed to fetch unread count" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    await Notification.findOneAndUpdate(
      { _id: notificationId, user: req.user.id },
      { read: true }
    );
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Failed to update notification" });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Failed to update notifications" });
  }
};


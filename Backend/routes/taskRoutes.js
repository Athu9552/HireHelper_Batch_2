const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, taskController.addTask);
router.get("/my-tasks", authMiddleware, taskController.getMyTasks);
router.get("/feed", authMiddleware, taskController.getFeed);

module.exports = router;

const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/send", authMiddleware, requestController.sendRequest);
router.get("/my-requests", authMiddleware, requestController.getMyRequests);
router.put("/update", authMiddleware, requestController.updateRequestStatus);

module.exports = router;

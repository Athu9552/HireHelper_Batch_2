const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/sidebar", dashboardController.getSidebar);
router.get("/feed", dashboardController.getFeed);

module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const reviewController = require("../controllers/reviewController");

router.post("/", auth, reviewController.createReview);
router.get("/user/:userId", auth, reviewController.getUserReviews);
router.get("/all", auth, reviewController.getAllReviews);
router.put("/:reviewId", auth, reviewController.updateReview);
router.delete("/:reviewId", auth, reviewController.deleteReview);

module.exports = router;


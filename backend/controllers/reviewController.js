const Review = require("../models/Review");

exports.createReview = async (req, res) => {
  try {
    const { reviewee, task, rating, comment, type } = req.body;

    const review = await Review.create({
      reviewer: req.user.id,
      reviewee,
      task,
      rating,
      comment,
      type
    });

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this user for this task" });
    }
    res.status(500).json({ message: err.message || "Failed to create review" });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ reviewee: userId }).populate(
      "reviewer",
      "first_name last_name"
    );
    res.json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Failed to fetch user reviews" });
  }
};

exports.getAllReviews = async (_req, res) => {
  try {
    const reviews = await Review.find()
      .populate("reviewer", "first_name last_name")
      .populate("reviewee", "first_name last_name");
    res.json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Failed to fetch reviews" });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findOneAndUpdate(
      { _id: reviewId, reviewer: req.user.id },
      { rating, comment },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Failed to update review" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      reviewer: req.user.id
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Failed to delete review" });
  }
};


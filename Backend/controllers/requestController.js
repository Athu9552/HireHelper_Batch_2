const Request = require("../models/Request");
const Task = require("../models/Task");

exports.sendRequest = async (req, res) => {
  try {
    const { task_id, receiver_id } = req.body;

    const request = new Request({
      task_id,
      sender_id: req.user.id,
      receiver_id
    });

    await request.save();
    res.json({ message: "Request sent successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ receiver_id: req.user.id });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { request_id, status } = req.body;

    const request = await Request.findOne({ id: request_id });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    await request.save();

    if (status === "accepted") {
      await Task.findOneAndUpdate(
        { id: request.task_id },
        { status: "assigned" }
      );
    }

    res.json({ message: "Request updated successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

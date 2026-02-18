const Task = require("../models/Task");

exports.addTask = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const task = new Task({
      title,
      description,
      category,
      created_by: req.user.id
    });

    await task.save();
    res.json({ message: "Task created successfully", task });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ created_by: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "open" });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const Task = require('../models/Task');

// Create a new task (with file upload support)
exports.createTask = async (req, res) => {
  try {
    const { title, description, location, startDate, startTime, endDate, endTime, category, budget } = req.body;
    let imagePath = null;
    
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const task = new Task({
      title,
      description,
      location,
      startDate,
      startTime,
      endDate: endDate || null,
      endTime: endTime || null,
      category,
      budget,
      image: imagePath,
      createdBy: req.user.id
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all tasks (Feed)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ status: 'open' })
      .populate('createdBy', 'first_name last_name email_id')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get tasks created by the logged-in user
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

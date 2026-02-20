const Request = require('../models/Request');
const Task = require('../models/Task');
const Notification = require('../models/Notification');

// Create a request (Apply for a task)
exports.createRequest = async (req, res) => {
  try {
    const { taskId, msg } = req.body;
    
    // Check if task exists
    const task = await Task.findById(taskId).populate('createdBy', 'first_name last_name');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Prevent requesting own task
    if (task.createdBy._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot request your own task' });
    }

    // Check if already requested
    const existing = await Request.findOne({ task: taskId, requester: req.user.id });
    if (existing) return res.status(400).json({ message: 'Already requested' });

    const request = new Request({
      task: taskId,
      requester: req.user.id,
      msg
    });
    await request.save();

    // Notifications:
    // 1) To requester (confirmation)
    await Notification.create({
      user: req.user.id,
      message: `Your request was sent for "${task.title}".`,
      type: 'task_request_sent',
      relatedTask: task._id,
      relatedRequest: request._id
    });

    // 2) To task owner
    await Notification.create({
      user: task.createdBy._id,
      message: `Someone requested your task "${task.title}".`,
      type: 'task_request_received',
      relatedTask: task._id,
      relatedRequest: request._id
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get requests sent by the logged-in user (My Requests)
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user.id })
      .populate({
        path: 'task',
        populate: { path: 'createdBy', select: 'first_name last_name' }

      })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get requests for tasks created by the logged-in user (Requests mainly for "Requests" tab)
exports.getIncomingRequests = async (req, res) => {
  try {
    // Find all tasks created by user
    const tasks = await Task.find({ createdBy: req.user.id });
    const taskIds = tasks.map(t => t._id);

    // Find requests for those tasks
    const requests = await Request.find({ task: { $in: taskIds } })
      .populate('task', 'title category')
      .populate('requester', 'first_name last_name email_id')

      .sort({ createdAt: -1 });
      
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update request status (Accept/Decline)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body; // status: 'accepted' or 'rejected'
    
    const request = await Request.findById(requestId)
      .populate('task')
      .populate('requester', 'first_name last_name');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Verify ownership of the task
    if (request.task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = status;
    await request.save();

    // Notify requester about status change
    await Notification.create({
      user: request.requester._id,
      message: `Your request for task "${request.task.title}" was ${status}.`,
      type: 'task_request_received',
      relatedTask: request.task._id,
      relatedRequest: request._id
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

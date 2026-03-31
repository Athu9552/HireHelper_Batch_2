const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hirehelper_tasks',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
  },
});

const upload = multer({ storage });

// Routes with file upload middleware
// Note the field name 'image' must match the frontend form data key
router.post('/', auth, upload.single('image'), taskController.createTask);
router.get('/', auth, taskController.getAllTasks); // Feed
router.get('/my', auth, taskController.getMyTasks); // My Tasks
router.delete('/:taskId', auth, taskController.deleteTask); // Delete task

module.exports = router;

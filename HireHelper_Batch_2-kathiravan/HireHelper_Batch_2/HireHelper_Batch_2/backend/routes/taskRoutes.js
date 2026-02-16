const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    // timestamp_filename.ext
    cb(null, Date.now() + '_' + file.originalname.replace(/\s+/g, '_')); 
  }
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Routes with file upload middleware
// Note the field name 'image' must match the frontend form data key
router.post('/', auth, upload.single('image'), taskController.createTask);
router.get('/', auth, taskController.getAllTasks); // Feed
router.get('/my', auth, taskController.getMyTasks); // My Tasks

module.exports = router;

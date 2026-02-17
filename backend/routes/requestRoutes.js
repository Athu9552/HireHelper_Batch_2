const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const auth = require('../middleware/auth');

router.post('/', auth, requestController.createRequest); // Apply
router.get('/my', auth, requestController.getMyRequests); // My Requests (sent)
router.get('/incoming', auth, requestController.getIncomingRequests); // Requests (received)
router.put('/status', auth, requestController.updateRequestStatus); // Accept/Decline

module.exports = router;

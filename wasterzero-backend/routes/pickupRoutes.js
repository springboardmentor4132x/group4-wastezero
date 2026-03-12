const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const pickupController = require('../controllers/pickupController');

// User Actions
router.post('/', authMiddleware, pickupController.createPickup);
router.get('/my', authMiddleware, pickupController.getMyPickups);

// Volunteer Actions
router.get('/available', authMiddleware, roleMiddleware('volunteer'), pickupController.getAvailablePickups);
router.put('/:id/status', authMiddleware, pickupController.updatePickupStatus);

// Admin Actions
router.get('/all', authMiddleware, roleMiddleware('admin'), pickupController.getAllPickups);

module.exports = router;

const express = require('express')
const scheduleController = require('../controllers/scheduleController.js')
const auth = require('../middleware/auth.js')

const scheduleRouter = express.Router()

// Create or update schedule
scheduleRouter.post('/create', auth, scheduleController.createSchedule)

// Get schedules by date range
scheduleRouter.get('/range', auth, scheduleController.getScheduleByDateRange)

// Toggle availability for a day
scheduleRouter.put(
  '/toggle-availability',
  auth,
  scheduleController.toggleAvailability
)

// Update time slots
scheduleRouter.put('/update-slots', auth, scheduleController.updateTimeSlots)

// Delete schedule
scheduleRouter.delete('/delete/:date', auth, scheduleController.deleteSchedule)

module.exports = scheduleRouter

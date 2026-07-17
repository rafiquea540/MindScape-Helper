const express = require('express')
const {
  sendEmailController,
  sendBulkEmailController,
} = require('../controllers/email')
const router = express.Router()

// Protected email routes
// Regular user can send single email
router.post('/send', sendEmailController)

// Only admin can send bulk emails
router.post('/send-bulk', sendBulkEmailController)

module.exports = router

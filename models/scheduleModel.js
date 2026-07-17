const mongoose = require('mongoose')

const timeSlotSchema = new mongoose.Schema({
  start: {
    type: String,
  },
  end: {
    type: String,
  },
})

const scheduleSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Doctor',
    },
    date: {
      type: Date,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    timeSlots: [timeSlotSchema],
    status: {
      type: String,
      enum: ['active', 'cancelled', 'completed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
)

// Compound index to ensure unique doctor schedule per date
scheduleSchema.index({ doctorId: 1, date: 1 }, { unique: true })

// Create virtual field for formatted date
scheduleSchema.virtual('formattedDate').get(function () {
  return this.date.toISOString().split('T')[0]
})

const Schedule = mongoose.model('Schedule', scheduleSchema)
module.exports = Schedule

const Appointment = require('../models/appointmentModel')
const Schedule = require('../models/scheduleModel')

const scheduleController = {
  // Create or update schedule for a specific date
  createSchedule: async (req, res) => {
    try {
      const { date, timeSlots, isAvailable, status } = req.body
      const doctorId = req.locals // Using existing req.locals

      const schedule = await Schedule.findOneAndUpdate(
        { doctorId, date: new Date(date) },
        {
          doctorId,
          date: new Date(date),
          timeSlots,
          isAvailable,
          status,
        },
        { upsert: true, new: true }
      )

      res.status(200).json({
        success: true,
        message: 'Schedule updated successfully',
        schedule,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating schedule',
        error: error.message,
      })
    }
  },

  getScheduleByDateRange: async (req, res) => {
    try {
      const { startDate, endDate, doctorId } = req.query
      const targetDoctorId = doctorId || req.locals

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required',
        })
      }

      // Fetch schedules and explicitly select the fields we want
      const schedules = await Schedule.find({
        doctorId: targetDoctorId,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      })
        .select('doctorId date isAvailable timeSlots') // Explicitly select fields
        .lean() // Convert to plain JavaScript object
        .sort({ date: 1 })

      const appointments = await Appointment.find({
        doctorId: targetDoctorId,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        status: { $ne: 'cancelled' },
      }).lean() // Convert to plain JavaScript object

      // Process schedules to include booking information
      const processedSchedules = schedules.map((schedule) => {
        const scheduleDate = schedule.date.toISOString().split('T')[0]
        const dayAppointments = appointments.filter(
          (apt) => apt.date.toISOString().split('T')[0] === scheduleDate
        )

        // Ensure timeSlots are properly formatted
        const formattedTimeSlots = (schedule.timeSlots || []).map((slot) => ({
          start: typeof slot.start === 'string' ? slot.start : '09:00',
          end: typeof slot.end === 'string' ? slot.end : '17:00',
          isBooked: dayAppointments.some(
            (apt) => apt.time.start === slot.start && apt.time.end === slot.end
          ),
        }))

        return {
          ...schedule,
          timeSlots: formattedTimeSlots,
          bookedAppointments: dayAppointments,
        }
      })

      res.status(200).json({
        success: true,
        schedules: processedSchedules,
      })
    } catch (error) {
      console.error('Schedule range error:', error)
      res.status(500).json({
        success: false,
        message: 'Error fetching schedules',
        error: error.message,
      })
    }
  },

  // Toggle day availability
  toggleAvailability: async (req, res) => {
    try {
      const { doctorId, date, isAvailable } = req.body

      const schedule = await Schedule.findOneAndUpdate(
        { doctorId, date: new Date(date) },
        { isAvailable },
        { new: true }
      )

      res.status(200).json({
        success: true,
        message: 'Availability updated successfully',
        schedule,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating availability',
        error: error.message,
      })
    }
  },

  // Update time slots for a specific date
  updateTimeSlots: async (req, res) => {
    try {
      const { doctorId, date, timeSlots } = req.body

      const schedule = await Schedule.findOneAndUpdate(
        { doctorId, date: new Date(date) },
        { timeSlots },
        { new: true }
      )

      res.status(200).json({
        success: true,
        message: 'Time slots updated successfully',
        schedule,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating time slots',
        error: error.message,
      })
    }
  },

  // Delete schedule for a specific date
  deleteSchedule: async (req, res) => {
    try {
      const { doctorId } = req.body
      const { date } = req.params

      await Schedule.findOneAndDelete({
        doctorId,
        date: new Date(date),
      })

      res.status(200).json({
        success: true,
        message: 'Schedule deleted successfully',
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting schedule',
        error: error.message,
      })
    }
  },
}

module.exports = scheduleController

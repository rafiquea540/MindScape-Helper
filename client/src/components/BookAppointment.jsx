import axios from 'axios'
import {
  Calendar as CalIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const BookAppointment = ({ setModalOpen, doctorId, doctorName }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [availableDays, setAvailableDays] = useState({})
  const [selectedDay, setSelectedDay] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [allTimeSlots, setAllTimeSlots] = useState({})
  const [bookedSlots, setBookedSlots] = useState({})

  useEffect(() => {
    fetchDoctorAvailability()
  }, [doctorId, currentDate])

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const fetchDoctorAvailability = async () => {
    setIsLoading(true)
    try {
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      )
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      )

      // Fetch available slots
      const availabilityResponse = await axios.get(
        'http://localhost:8800/api/schedule/range',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            doctorId,
          },
        }
      )

      // Fetch booked appointments
      const bookedResponse = await axios.get(
        'http://localhost:8800/api/appointment/doctor-appointments',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            doctorId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        }
      )

      if (
        availabilityResponse.data.success &&
        availabilityResponse.data.schedules
      ) {
        const availabilityMap = {}
        const slotsMap = {}
        const bookedSlotsMap = {}

        // Process booked appointments
        if (bookedResponse.data.success && bookedResponse.data.appointments) {
          bookedResponse.data.appointments.forEach((appointment) => {
            const dateStr = new Date(appointment.date)
              .toISOString()
              .split('T')[0]
            if (!bookedSlotsMap[dateStr]) {
              bookedSlotsMap[dateStr] = []
            }
            bookedSlotsMap[dateStr].push({
              start: appointment.time.start,
              end: appointment.time.end,
            })
          })
        }

        // Process available schedules
        // Process available schedules
        availabilityResponse.data.schedules.forEach((schedule) => {
          if (schedule && schedule.date && schedule.isAvailable) {
            const dateStr = new Date(schedule.date).toISOString().split('T')[0]
            availabilityMap[dateStr] = schedule.isAvailable
            // Ensure timeSlots are properly formatted
            slotsMap[dateStr] = (schedule.timeSlots || []).map((slot) => ({
              start: slot.start,
              end: slot.end,
            }))
          }
        })

        setAvailableDays(availabilityMap)
        setAllTimeSlots(slotsMap)
        setBookedSlots(bookedSlotsMap)
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
      toast.error("Unable to fetch doctor's availability")
    } finally {
      setIsLoading(false)
    }
  }

  const isSlotBooked = (date, slot) => {
    const dayBookings = bookedSlots[date] || []
    return dayBookings.some(
      (booking) => booking.start === slot.start && booking.end === slot.end
    )
  }

  const handleDaySelect = async (date) => {
    setSelectedDay(date)
    setSelectedSlot(null)

    try {
      const daySlots = allTimeSlots[date] || []
      console.log('Day slots:', daySlots) // Debug log

      const formattedSlots = daySlots
        .filter((slot) => {
          const isBooked = isSlotBooked(date, slot)
          console.log('Slot:', slot, 'isBooked:', isBooked) // Debug log
          return !isBooked
        })
        .map((slot) => ({
          original: {
            start: slot.start,
            end: slot.end,
          },
          display: `${formatTime(slot.start)} - ${formatTime(slot.end)}`,
        }))

      console.log('Formatted slots:', formattedSlots) // Debug log
      setAvailableSlots(formattedSlots)
    } catch (error) {
      console.error('Error setting time slots:', error)
      toast.error('Unable to fetch available time slots')
      setAvailableSlots([])
    }
  }

  const bookAppointment = async (e) => {
    e.preventDefault()
    if (!selectedDay || !selectedSlot) {
      toast.error('Please select both date and time')
      return
    }

    try {
      // Format the time as a string
      const timeString = `${selectedSlot.original.start}-${selectedSlot.original.end}`

      await toast.promise(
        axios.post(
          'http://localhost:8800/api/appointment/bookappointment',
          {
            doctorId,
            date: selectedDay,
            time: timeString, // Send time as a string instead of an object
            doctorname: doctorName,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        ),
        {
          loading: 'Booking appointment...',
          success: 'Appointment booked successfully',
          error: 'Unable to book appointment',
        }
      )
      setModalOpen(false)
    } catch (error) {
      console.error('Appointment booking error:', error)
    }
  }

  // ... rest of your existing code for navigation, months array, and calendar rendering ...
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const renderCalendar = () => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate()
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay()
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className='h-12 bg-gray-50/50' />)
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const isAvailable = availableDays[dateString]
      const daySlots = allTimeSlots[dateString] || []
      const bookedDaySlots = bookedSlots[dateString] || []
      const hasAvailableSlots = daySlots.some(
        (slot) => !isSlotBooked(dateString, slot)
      )
      const isSelected = selectedDay === dateString
      const isToday =
        new Date().toDateString() === new Date(dateString).toDateString()
      const isPast =
        new Date(dateString) < new Date(new Date().setHours(0, 0, 0, 0))

      days.push(
        <button
          key={day}
          onClick={() =>
            !isPast &&
            isAvailable &&
            hasAvailableSlots &&
            handleDaySelect(dateString)
          }
          disabled={!isAvailable || !hasAvailableSlots || isPast}
          className={`
            h-12 w-full relative rounded-lg transition-all
            ${
              isPast
                ? 'cursor-not-allowed bg-gray-100'
                : isAvailable && hasAvailableSlots
                ? 'hover:bg-green-50 cursor-pointer'
                : 'cursor-not-allowed bg-gray-50'
            }
            ${isSelected ? 'ring-2 ring-green-500' : ''}
            ${isToday ? 'font-bold' : ''}
          `}
        >
          <span
            className={`
            ${
              isPast
                ? 'text-gray-400'
                : isAvailable && hasAvailableSlots
                ? 'text-gray-900'
                : 'text-gray-400'
            }
            ${isSelected ? 'text-green-700' : ''}
          `}
          >
            {day}
          </span>
          {isAvailable && hasAvailableSlots && !isPast && (
            <div className='absolute bottom-1 left-1/2 transform -translate-x-1/2'>
              <div className='h-1 w-1 rounded-full bg-green-500'></div>
            </div>
          )}
        </button>
      )
    }

    return days
  }

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-10'>
      <div className='relative bg-white rounded-xl shadow-xl p-6 m-4 max-w-4xl w-full'>
        <button
          onClick={() => setModalOpen(false)}
          className='absolute top-4 right-4 text-gray-600 hover:text-gray-800'
        >
          <X size={24} />
        </button>

        <h2 className='text-2xl font-bold mb-2 text-gray-900'>
          Book Appointment
        </h2>
        <p className='mb-6 text-gray-600'>with Dr. {doctorName}</p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white rounded-xl border p-4'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center space-x-2'>
                <CalIcon className='w-5 h-5 text-green-600' />
                <h3 className='text-lg font-semibold text-gray-800'>
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
              </div>
              <div className='flex space-x-2'>
                <button
                  onClick={() => navigateMonth(-1)}
                  className='p-1 hover:bg-gray-100 rounded-lg'
                  disabled={
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear()
                  }
                >
                  <ChevronLeft className='w-5 h-5' />
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className='p-1 hover:bg-gray-100 rounded-lg'
                >
                  <ChevronRight className='w-5 h-5' />
                </button>
              </div>
            </div>

            <div className='grid grid-cols-7 gap-2 mb-2'>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className='text-center text-sm font-medium text-gray-600'
                >
                  {day}
                </div>
              ))}
            </div>

            <div className='grid grid-cols-7 gap-2'>
              {isLoading ? (
                <div className='col-span-7 h-48 flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-500'></div>
                </div>
              ) : (
                renderCalendar()
              )}
            </div>
          </div>

          <div className='bg-white rounded-xl border p-4'>
            <div className='flex items-center space-x-2 mb-4'>
              <Clock className='w-5 h-5 text-green-600' />
              <h3 className='text-lg font-semibold text-gray-800'>
                Available Times
              </h3>
            </div>

            {selectedDay ? (
              <>
                <div className='text-sm text-gray-600 mb-4'>
                  Select a time slot for{' '}
                  {new Date(selectedDay).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div className='grid grid-cols-2 gap-2 max-h-64 overflow-y-auto'>
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        console.log('Selecting slot:', slot) // Debug log
                        setSelectedSlot(slot)
                      }}
                      className={`
        p-2 rounded-lg text-sm transition-colors
        ${
          selectedSlot &&
          selectedSlot.original.start === slot.original.start &&
          selectedSlot.original.end === slot.original.end
            ? 'bg-green-500 text-white'
            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
        }
      `}
                    >
                      {slot.display}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className='text-center py-8 text-gray-500'>
                Select a date to view available times
              </div>
            )}

            {selectedDay && selectedSlot && (
              <button
                onClick={bookAppointment}
                className='mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors'
              >
                Book Appointment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookAppointment

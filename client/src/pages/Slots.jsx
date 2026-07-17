import axios from 'axios'
import {
  Calendar as CalIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Save,
  X,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Navbar from '../components/Navbar'

const CalendarAvailability = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [availableDays, setAvailableDays] = useState({})
  const [selectedDay, setSelectedDay] = useState(null)
  const [timeSlots, setTimeSlots] = useState({})
  const [loading, setLoading] = useState(false)
  const [modifiedDates, setModifiedDates] = useState(new Set())

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

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const fetchMonthSchedules = async () => {
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

      const response = await axios.get(
        'http://localhost:8800/api/schedule/range',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        }
      )

      console.log('API Response:', response.data)

      if (response.data.success && response.data.schedules) {
        const scheduleMap = {}
        const timeSlotsMap = {}

        response.data.schedules.forEach((schedule) => {
          if (schedule && schedule.date) {
            const dateStr = new Date(schedule.date).toISOString().split('T')[0]
            scheduleMap[dateStr] = schedule.isAvailable
            timeSlotsMap[dateStr] = schedule.timeSlots || []
          }
        })

        setAvailableDays(scheduleMap)
        setTimeSlots(timeSlotsMap)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch schedules')
      console.error('Error fetching schedules:', error)
    }
  }

  const saveSchedule = async () => {
    setLoading(true)
    try {
      const scheduleUpdates = Array.from(modifiedDates).map((date) => ({
        date,
        isAvailable: availableDays[date],
        timeSlots: timeSlots[date] || [],
        status: 'active',
      }))

      const responses = await Promise.all(
        scheduleUpdates.map((schedule) =>
          axios.post('http://localhost:8800/api/schedule/create', schedule, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          })
        )
      )

      const allSuccessful = responses.every((response) => response.data.success)

      if (allSuccessful) {
        toast.success('All schedules updated successfully')
        setModifiedDates(new Set()) // Clear modified dates after successful save
        await fetchMonthSchedules() // Refresh the calendar
      } else {
        toast.warning('Some schedules may not have been updated')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save schedules')
      console.error('Error saving schedules:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMonthSchedules()
  }, [currentDate])

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const toggleDayAvailability = (day) => {
    const dateString = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    setModifiedDates((prev) => new Set(prev).add(dateString))
    setAvailableDays((prev) => ({
      ...prev,
      [dateString]: !prev[dateString],
    }))
    setSelectedDay(dateString)

    if (!timeSlots[dateString]) {
      setTimeSlots((prev) => ({
        ...prev,
        [dateString]: [{ start: '09:00', end: '17:00' }],
      }))
    }
  }

  const addTimeSlot = (date) => {
    setModifiedDates((prev) => new Set(prev).add(date))
    setTimeSlots((prev) => ({
      ...prev,
      [date]: [...(prev[date] || []), { start: '09:00', end: '17:00' }],
    }))
  }

  const updateTimeSlot = (date, index, field, value) => {
    setModifiedDates((prev) => new Set(prev).add(date))
    setTimeSlots((prev) => ({
      ...prev,
      [date]: prev[date].map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      ),
    }))
  }

  const removeTimeSlot = (date, index) => {
    setModifiedDates((prev) => new Set(prev).add(date))
    setTimeSlots((prev) => ({
      ...prev,
      [date]: prev[date].filter((_, i) => i !== index),
    }))
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className='h-28 bg-gray-50/50 border border-gray-100 rounded-lg'
        />
      )
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const isAvailable = availableDays[dateString]
      const isSelected = selectedDay === dateString
      const isToday =
        new Date().toDateString() === new Date(dateString).toDateString()
      const slots = timeSlots[dateString] || []

      days.push(
        <div
          key={day}
          onClick={() => toggleDayAvailability(day)}
          className={`h-28 border transition-all duration-200 cursor-pointer rounded-lg overflow-hidden
            ${
              isAvailable
                ? 'bg-green-50/70 hover:bg-green-100 border-green-200'
                : 'bg-white hover:bg-gray-50 border-gray-200'
            }
            ${isSelected ? 'ring-2 ring-blue-500 shadow-md' : ''}
            ${isToday ? 'border-blue-300' : ''}
          `}
        >
          <div className='p-2 bg-white/60 border-b border-gray-100'>
            <div className='flex justify-between items-center'>
              <span
                className={`font-medium text-lg ${
                  isToday ? 'text-blue-600' : ''
                }`}
              >
                {day}
              </span>
              {isAvailable ? (
                <span className='flex items-center text-xs text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full'>
                  <Check className='w-3 h-3 mr-1' />
                  Available
                </span>
              ) : (
                <span className='flex items-center text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full'>
                  <X className='w-3 h-3 mr-1' />
                  Closed
                </span>
              )}
            </div>
          </div>

          {isAvailable && slots.length > 0 && (
            <div className='p-1.5 max-h-[calc(100%-2.5rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent'>
              {slots.map((slot, idx) => (
                <div
                  key={idx}
                  className='text-xs text-gray-600 bg-white/80 px-2 py-1 rounded mb-1 flex items-center'
                >
                  <Clock className='w-3 h-3 mr-1 flex-shrink-0' />
                  <span className='truncate'>
                    {formatTime(slot.start)} - {formatTime(slot.end)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    return days
  }

  return (
    <>
      <Navbar />
      <div className='mt-10 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              Schedule Management
            </h1>
            <p className='text-gray-600'>
              Manage your availability and working hours
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2'>
              <div className='bg-white rounded-2xl shadow-lg p-6 backdrop-blur-xl bg-white/90'>
                <div className='flex items-center justify-between mb-8'>
                  <div className='flex items-center space-x-3'>
                    <CalIcon className='w-6 h-6 text-blue-600' />
                    <h2 className='text-2xl font-semibold text-gray-800'>
                      {months[currentDate.getMonth()]}{' '}
                      {currentDate.getFullYear()}
                    </h2>
                  </div>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => navigateMonth(-1)}
                      className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                    >
                      <ChevronLeft className='w-5 h-5' />
                    </button>
                    <button
                      onClick={() => navigateMonth(1)}
                      className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                    >
                      <ChevronRight className='w-5 h-5' />
                    </button>
                  </div>
                </div>

                <div className='grid grid-cols-7 gap-3'>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                    (day) => (
                      <div
                        key={day}
                        className='h-12 flex items-center justify-center font-medium text-gray-600'
                      >
                        {day}
                      </div>
                    )
                  )}
                  {renderCalendar()}
                </div>
              </div>
            </div>

            <div className='bg-white rounded-2xl shadow-lg p-6 backdrop-blur-xl bg-white/90'>
              <h3 className='text-xl font-semibold mb-6 text-gray-800'>
                Time Slots
              </h3>
              {selectedDay ? (
                <div className='space-y-4'>
                  <div className='flex items-center justify-between mb-4'>
                    <span className='text-gray-600 font-medium'>
                      {new Date(selectedDay).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <button
                      onClick={() => addTimeSlot(selectedDay)}
                      className='text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    >
                      Add Slot
                    </button>
                  </div>

                  <div className='space-y-4 max-h-[calc(100vh-24rem)] overflow-y-auto'>
                    {timeSlots[selectedDay]?.map((slot, index) => (
                      <div
                        key={index}
                        className='p-4 bg-gray-50 rounded-xl border border-gray-200'
                      >
                        <div className='flex items-center justify-between mb-3'>
                          <span className='text-sm font-medium text-gray-700'>
                            Slot {index + 1}
                          </span>
                          <button
                            onClick={() => removeTimeSlot(selectedDay, index)}
                            className='text-sm text-red-600 hover:text-red-800 transition-colors'
                          >
                            Remove
                          </button>
                        </div>
                        <div className='flex flex-col sm:flex-row gap-3'>
                          <div className='flex-1'>
                            <label className='block text-sm text-gray-600 mb-2'>
                              Start Time
                            </label>
                            <div className='relative'>
                              <Clock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                              <input
                                type='time'
                                value={slot.start}
                                onChange={(e) =>
                                  updateTimeSlot(
                                    selectedDay,
                                    index,
                                    'start',
                                    e.target.value
                                  )
                                }
                                className='w-full pl-10 pr-4 py-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                              />
                            </div>
                          </div>
                          <div className='flex-1'>
                            <label className='block text-sm text-gray-600 mb-2'>
                              End Time
                            </label>
                            <div className='relative'>
                              <Clock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                              <input
                                type='time'
                                value={slot.end}
                                onChange={(e) =>
                                  updateTimeSlot(
                                    selectedDay,
                                    index,
                                    'end',
                                    e.target.value
                                  )
                                }
                                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {modifiedDates.size > 0 && (
                    <button
                      onClick={saveSchedule}
                      disabled={loading}
                      className='mt-6 w-full inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:bg-gray-400'
                    >
                      <Save className='w-5 h-5 mr-2' />
                      {loading
                        ? 'Saving...'
                        : `Save Changes (${modifiedDates.size} ${
                            modifiedDates.size === 1 ? 'day' : 'days'
                          })`}
                    </button>
                  )}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <CalIcon className='w-12 h-12 text-gray-400 mx-auto mb-3' />
                  <p className='text-gray-500'>
                    Select a day to manage time slots
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CalendarAvailability

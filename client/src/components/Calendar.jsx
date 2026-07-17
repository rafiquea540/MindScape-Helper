import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useState } from 'react'

const CalendarBox = () => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    )
  }

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    )
  }

  const renderCalendar = () => {
    const days = daysInMonth(currentDate)
    const firstDay = firstDayOfMonth(currentDate)
    const calendarDays = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(
        <div key={`empty-${i}`} className='text-center py-2'></div>
      )
    }

    // Add cells for each day of the month
    for (let i = 1; i <= days; i++) {
      const isToday =
        new Date().toDateString() ===
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          i
        ).toDateString()
      calendarDays.push(
        <div
          key={i}
          className={`text-center py-2 ${
            isToday
              ? 'bg-green-500 text-white rounded-full'
              : 'hover:bg-green-100'
          }`}
        >
          {i}
        </div>
      )
    }

    return calendarDays
  }

  return (
    <div className='bg-white p-4 rounded-lg shadow'>
      <div className='flex justify-between items-center mb-4'>
        <button
          onClick={prevMonth}
          className='text-green-600 hover:text-green-800'
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className='text-xl font-semibold'>
          {currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <button
          onClick={nextMonth}
          className='text-green-600 hover:text-green-800'
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <div className='grid grid-cols-7 gap-1'>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className='text-center font-medium text-green-800'>
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>
    </div>
  )
}

export default CalendarBox

import { Brain, Calendar, Clock, Search, Users } from 'lucide-react'
import React from 'react'
import Navbar from '../components/Navbar'

const StatCard = ({ title, value, icon: Icon }) => (
  <div className='bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all'>
    <div className='flex items-center gap-3 mb-3'>
      <div className='bg-green-100 p-2 rounded-lg'>
        <Icon className='text-green-600' size={20} />
      </div>
      <h3 className='text-gray-600 font-medium'>{title}</h3>
    </div>
    <p className='text-3xl font-bold text-gray-900'>{value}</p>
  </div>
)

const PatientCard = ({ name, appointmentTime, status, lastVisit }) => (
  <div className='bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all'>
    <div className='flex items-center gap-4'>
      <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
        <span className='text-green-600 font-semibold text-lg'>
          {name.charAt(0)}
        </span>
      </div>
      <div className='flex-1'>
        <h3 className='font-medium text-gray-900'>{name}</h3>
        <p className='text-sm text-gray-500'>Last visit: {lastVisit}</p>
      </div>
      <div className='text-right'>
        <p className='text-sm font-medium text-gray-600'>{appointmentTime}</p>
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1
          ${
            status === 'Upcoming'
              ? 'bg-blue-100 text-blue-600'
              : status === 'Completed'
              ? 'bg-green-100 text-green-600'
              : 'bg-yellow-100 text-yellow-600'
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  </div>
)

const DoctorDashboard = () => {
  return (
    <>
      <Navbar />
      <div className='mt-10 min-h-screen bg-gray-50'>
        <Navbar />

        <main className='max-w-7xl mx-auto px-4 py-8'>
          {/* Header */}
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Patient Overview
              </h1>
              <p className='text-gray-600'>
                Keep track of your patients and appointments
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
            <StatCard title='Total Patients' value='124' icon={Users} />
            <StatCard title="Today's Appointments" value='8' icon={Calendar} />
            <StatCard title='Pending Sessions' value='3' icon={Clock} />
          </div>

          {/* Recent Patients */}
          <div className='mb-6'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Recent Patients
            </h2>
            <div className='grid gap-4'>
              <PatientCard
                name='Falak Shabbir'
                appointmentTime='10:00 AM'
                status='Upcoming'
                lastVisit='2 days ago'
              />
              <PatientCard
                name='Aiman Khan'
                appointmentTime='11:30 AM'
                status='Completed'
                lastVisit='Yesterday'
              />
              <PatientCard
                name='Malik Riaz'
                appointmentTime='2:00 PM'
                status='Pending'
                lastVisit='1 week ago'
              />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default DoctorDashboard

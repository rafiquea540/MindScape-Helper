import { motion } from 'framer-motion'
import {
  Activity,
  Bell,
  Calendar,
  ChevronRight,
  Clock,
  Coffee,
  Search,
  User,
  Users,
} from 'lucide-react'
import React from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Sidebar from '../components/Sidebar'

const data = [
  { name: 'Jan', patients: 30, appointments: 40 },
  { name: 'Feb', patients: 25, appointments: 35 },
  { name: 'Mar', patients: 35, appointments: 45 },
  { name: 'Apr', patients: 40, appointments: 50 },
  { name: 'May', patients: 28, appointments: 38 },
  { name: 'Jun', patients: 32, appointments: 42 },
  { name: 'Jul', patients: 38, appointments: 48 },
  { name: 'Aug', patients: 42, appointments: 52 },
  { name: 'Sep', patients: 45, appointments: 55 },
  { name: 'Oct', patients: 50, appointments: 60 },
  { name: 'Nov', patients: 55, appointments: 65 },
  { name: 'Dec', patients: 60, appointments: 70 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
}

const Analytics = () => {
  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' })

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'>
      <Sidebar />
      <motion.div
        className='ml-0 lg:ml-64 p-4 lg:p-8'
        initial='hidden'
        animate='visible'
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className='mb-8'>
          <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0'>
            <div>
              <h1 className='text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent'>
                Admin Dashboard
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'
          variants={containerVariants}
        >
          {[
            {
              icon: Users,
              value: '187',
              label: 'Total Patients',
              change: '+12%',
              bgColor: 'bg-emerald-100',
              textColor: 'text-emerald-600',
            },
            {
              icon: Calendar,
              value: '42',
              label: 'Appointments',
              change: 'Today',
              bgColor: 'bg-green-100',
              textColor: 'text-green-600',
            },
            {
              icon: Coffee,
              value: '30 min',
              label: 'Break Time',
              change: 'Next at 2:30 PM',
              bgColor: 'bg-teal-100',
              textColor: 'text-teal-600',
            },
            {
              icon: Clock,
              value: '98%',
              label: 'Response Rate',
              change: '+5%',
              bgColor: 'bg-emerald-100',
              textColor: 'text-emerald-600',
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className='bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100'
              whileHover={{ y: -4 }}
            >
              <div className='flex items-center justify-between mb-4'>
                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                  <stat.icon className={stat.textColor} size={24} />
                </div>
                <Activity
                  className={
                    stat.change.includes('+')
                      ? 'text-emerald-500'
                      : 'text-gray-400'
                  }
                  size={20}
                />
              </div>
              <h3 className='text-2xl font-bold text-gray-800'>{stat.value}</h3>
              <p className='text-gray-600 mt-1'>{stat.label}</p>
              <p
                className={`text-sm mt-3 ${
                  stat.change.includes('+')
                    ? 'text-emerald-600'
                    : 'text-gray-500'
                }`}
              >
                {stat.change}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Current Patient Card */}
        <motion.div
          className='bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100'
          variants={itemVariants}
        >
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-semibold text-gray-800'>
              Current Patient
            </h2>
            <span className='px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-sm'>
              In Session
            </span>
          </div>
          <motion.div
            className='flex flex-col md:flex-row md:items-center gap-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl'
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className='flex items-center gap-4'>
              <div className='w-20 h-20 bg-gradient-to-r from-emerald-400 to-green-400 rounded-xl flex items-center justify-center'>
                <User size={40} className='text-white' />
              </div>
              <div>
                <h3 className='text-xl font-semibold text-gray-800'>
                  Aizan Khan
                </h3>
                <p className='text-gray-600'>Male, 35Y</p>
                <div className='flex gap-2 mt-2'>
                  <span className='px-2 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs'>
                    Anxiety
                  </span>
                  <span className='px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs'>
                    Depression
                  </span>
                </div>
              </div>
            </div>
            <div className='flex gap-4 md:ml-auto'>
              <button className='px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors'>
                View Details
              </button>
              <button className='px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors'>
                End Session
              </button>
            </div>
          </motion.div>

          <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='p-4 bg-gray-50 rounded-xl border border-gray-100'>
              <h4 className='font-semibold text-gray-800 mb-4'>Symptoms</h4>
              <ul className='space-y-3'>
                {['Anxiety', 'Depression', 'Insomnia', 'Fatigue'].map(
                  (symptom, index) => (
                    <li
                      key={index}
                      className='flex items-center text-gray-600 bg-white p-2 rounded-lg'
                    >
                      <div className='w-2 h-2 bg-emerald-400 rounded-full mr-3' />
                      {symptom}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className='p-4 bg-gray-50 rounded-xl border border-gray-100'>
              <h4 className='font-semibold text-gray-800 mb-4'>
                Medical History
              </h4>
              <ul className='space-y-3'>
                {[
                  'Chronic Anxiety',
                  'Major Depressive Disorder',
                  'History of Panic Attacks',
                  'Sleep Disorders',
                ].map((item, index) => (
                  <li
                    key={index}
                    className='flex items-center text-gray-600 bg-white p-2 rounded-lg'
                  >
                    <div className='w-2 h-2 bg-green-400 rounded-full mr-3' />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Bottom Grid */}
        <motion.div
          className='grid grid-cols-1 lg:grid-cols-4 gap-6'
          variants={containerVariants}
        >
          {/* Patients Queue */}
          <motion.div
            className='lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100'
            variants={itemVariants}
          >
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Patients Queue
              </h2>
              <span className='text-sm text-emerald-600'>4 Waiting</span>
            </div>
            <div className='space-y-4'>
              {['Amir Khan', 'Fatima Ali', 'Ayesha Siddiqui', 'Hamza Khan'].map(
                (name, index) => (
                  <motion.div
                    key={index}
                    className='flex items-center gap-3 p-3 hover:bg-emerald-50 rounded-xl cursor-pointer group transition-colors'
                    whileHover={{ x: 5 }}
                  >
                    <div className='w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-400 rounded-xl flex items-center justify-center text-white font-medium'>
                      {name.split(' ')[0][0]}
                    </div>
                    <div className='flex-1'>
                      <p className='font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors'>
                        {name}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {index === 0 || index === 3
                          ? 'Male, 30Y'
                          : 'Female, 25Y'}
                      </p>
                    </div>
                    <ChevronRight
                      className='text-gray-400 group-hover:text-emerald-600 transition-colors'
                      size={20}
                    />
                  </motion.div>
                )
              )}
            </div>
          </motion.div>

          {/* Statistics Chart */}
          <motion.div
            className='lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-100'
            variants={itemVariants}
          >
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Patient Statistics
              </h2>
              <select className='p-2 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400'>
                <option>Last 12 Months</option>
                <option>Last 6 Months</option>
                <option>Last 3 Months</option>
              </select>
            </div>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                <XAxis dataKey='name' stroke='#6b7280' />
                <YAxis stroke='#6b7280' />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='patients'
                  stroke='#059669'
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type='monotone'
                  dataKey='appointments'
                  stroke='#10B981'
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Analytics

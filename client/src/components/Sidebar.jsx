import axios from 'axios'
import { motion } from 'framer-motion'
import jwt_decode from 'jwt-decode'
import {
  Home,
  List,
  LogOut,
  Mail,
  Menu,
  Stethoscope,
  User,
  Users,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import fetchData from '../helper/apiCall'
import { setLoading, setUserInfo } from '../redux/reducers/rootSlice'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [userData, setUserData] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Assuming you store the user ID in localStorage or Redux after login
  const { userId } = jwt_decode(localStorage.getItem('token'))
  const fetchUserData = async () => {
    try {
      dispatch(setLoading(true))
      const temp = await fetchData(
        `http://localhost:8800/api/user/getuser/${userId}`
      )
      setUserData(temp) // Note: using temp directly since fetchData already processes the response
      dispatch(setLoading(false))
    } catch (error) {
      console.error('Error fetching user data:', error)
      dispatch(setLoading(false))
    }
  }
  useEffect(() => {
    if (userId) {
      fetchUserData()
    }
  }, [userId])

  const sidebar = [
    { name: 'Home', path: '/dashboard/analytics', icon: <Home size={20} /> },
    { name: 'Users', path: '/dashboard/users', icon: <Users size={20} /> },
    {
      name: 'Doctors',
      path: '/dashboard/doctors',
      icon: <Stethoscope size={20} />,
    },
    {
      name: 'Appointments',
      path: '/dashboard/appointments',
      icon: <List size={20} />,
    },
    {
      name: 'Applications',
      path: '/dashboard/applications',
      icon: <Mail size={20} />,
    },
    { name: 'Profile', path: `/profile/`, icon: <User size={20} /> },
  ]

  const logoutFunc = () => {
    dispatch(setUserInfo({}))
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    navigate('/login')
  }

  return (
    <motion.div
      initial={false}
      animate={{
        width: isOpen ? 256 : 72,
        transition: { duration: 0.3, ease: 'easeInOut' },
      }}
      className='fixed top-0 left-0 h-full bg-gradient-to-b from-green-900 to-emerald-800 text-white shadow-xl z-50'
    >
      <div className='flex flex-col h-full'>
        {/* Logo Section */}
        <div className='h-16 flex items-center justify-between px-4'>
          <motion.div
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0 }}
            className='flex items-center space-x-3'
          >
            <div className='w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center'>
              <Stethoscope size={20} className='text-white' />
            </div>
            {isOpen && (
              <span className='text-lg font-semibold text-white'>
                MindScape
              </span>
            )}
          </motion.div>
          <button
            className='w-8 h-8 flex items-center justify-center rounded-lg hover:bg-green-800 transition-colors'
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className='flex-1 px-2 py-4'>
          <ul className='space-y-1'>
            {sidebar.map((item, index) => (
              <motion.li key={index} whileHover={{ x: 4 }} className='relative'>
                <a
                  href={item.path}
                  className='flex items-center px-3 py-3 rounded-lg hover:bg-green-800/50 transition-colors group'
                >
                  <div className='flex items-center justify-center w-8 h-8 text-emerald-400 group-hover:text-emerald-300'>
                    {item.icon}
                  </div>
                  {isOpen && (
                    <motion.span
                      initial={false}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='ml-3 text-sm font-medium text-gray-100 group-hover:text-white'
                    >
                      {item.name}
                    </motion.span>
                  )}
                  <motion.div
                    initial={false}
                    animate={{
                      width: isOpen ? 2 : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    className='absolute left-0 top-1/2 -translate-y-1/2 h-5 bg-emerald-400 rounded-r-full transform origin-left opacity-0 group-hover:opacity-100 transition-opacity'
                  />
                </a>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className='p-2 mb-4'>
          <motion.button
            whileHover={{ x: 4 }}
            onClick={logoutFunc}
            className='w-full flex items-center px-3 py-3 rounded-lg hover:bg-red-500/20 text-red-200 hover:text-red-100 transition-colors group'
          >
            <div className='flex items-center justify-center w-8 h-8'>
              <LogOut size={20} />
            </div>
            {isOpen && (
              <motion.span
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='ml-3 text-sm font-medium'
              >
                Logout
              </motion.span>
            )}
          </motion.button>
        </div>

        {/* Profile Section */}
        {isOpen && userData && (
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='p-4 mx-2 mb-4 bg-green-800/50 rounded-lg'
          >
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center'>
                <User size={20} className='text-white' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-white truncate'>
                  {userData?.firstname} {userData?.lastname || 'User'}
                </p>
                <p className='text-xs text-emerald-300 truncate'>
                  {userData?.isAdmin ? 'Admin' : 'Doctor'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Sidebar

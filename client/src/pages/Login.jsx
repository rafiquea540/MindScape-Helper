import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import jwt_decode from 'jwt-decode'
import { ArrowRight, Brain, Lock, Mail, Sparkles, Shield, Cpu, Zap, AlertCircle } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import fetchData from '../helper/apiCall'
import { setUserInfo } from '../redux/reducers/rootSlice'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formDetails, setFormDetails] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formDetails.email) {
      newErrors.email = 'Identifier required'
    } else if (!emailRegex.test(formDetails.email)) {
      newErrors.email = 'Invalid digital address'
    }

    if (!formDetails.password) {
      newErrors.password = 'Access key required'
    } else if (formDetails.password.length < 8) {
      newErrors.password = 'Key must be at least 8 units'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const inputChange = (e) => {
    const { name, value } = e.target
    setFormDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const getUser = async (id) => {
    try {
      const temp = await fetchData(
        `http://localhost:8800/api/user/getuser/${id}`
      )
      dispatch(setUserInfo(temp))
      return navigate('/')
    } catch (error) {
      return error
    }
  }

  const formSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)

    try {
      const { email, password } = formDetails

      const { data } = await toast.promise(
        axios.post('http://localhost:8800/api/user/login', {
          email,
          password,
        }),
        {
          loading: 'Synchronizing neural link...',
          success: 'Authentication successful',
          error: 'Access denied: Invalid credentials',
        }
      )

      localStorage.setItem('token', data.token)
      const decoded = jwt_decode(data.token)
      dispatch(setUserInfo(decoded.userId))
      await getUser(decoded.userId)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-gray-50 dark:bg-[#050505] transition-colors duration-500 pt-24 pb-12 px-4 relative overflow-hidden flex items-center justify-center'>

        {/* Futuristic Background Elements */}
        <div className='absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]'
          style={{
            backgroundImage: `linear-gradient(#f00 1px, transparent 1px), linear-gradient(90deg, #f00 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full' />
        <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/5 blur-[120px] rounded-full' />

        <div className='max-w-xl w-full relative z-10'>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className='bg-white/80 dark:bg-gray-900/50 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden'
          >
            {/* Design Header */}
            <div className='relative p-10 text-center border-b border-gray-100 dark:border-gray-800 bg-gradient-to-b from-red-50 to-transparent dark:from-red-950/10'>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className='inline-flex p-4 bg-red-600 rounded-3xl shadow-[0_0_20px_rgba(239,68,68,0.4)] mb-6'
              >
                <Cpu className='w-10 h-10 text-white' />
              </motion.div>
              <h1 className='text-4xl font-black text-gray-900 dark:text-white tracking-tighter'>
                CORE <span className='text-red-600'>AUTHENTICATION</span>
              </h1>
              <p className='text-gray-500 dark:text-gray-400 mt-2 font-medium'>
                Verify your identity to access the neural network
              </p>
            </div>

            {/* Form */}
            <div className='p-10'>
              <form onSubmit={formSubmit} className='space-y-8'>

                {/* Email Input */}
                <div className='space-y-3'>
                  <div className='flex justify-between items-center px-1'>
                    <label className='text-xs font-black text-gray-400 uppercase tracking-widest'>Digital Identifier</label>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.span
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className='text-[10px] font-bold text-red-500 uppercase flex items-center gap-1'
                        >
                          <AlertCircle size={10} /> {errors.email}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className='relative group'>
                    <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${errors.email ? 'text-red-500' : 'text-gray-400 group-focus-within:text-red-500'}`} />
                    <input
                      type='email'
                      name='email'
                      value={formDetails.email}
                      onChange={inputChange}
                      className={`w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-gray-800/50 border-2 rounded-2xl outline-none transition-all dark:text-white font-medium ${errors.email ? 'border-red-500' : 'border-transparent focus:border-red-600 dark:focus:border-red-600/50 hover:bg-white dark:hover:bg-gray-800'}`}
                      placeholder='mail@nexus.ai'
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className='space-y-3'>
                  <div className='flex justify-between items-center px-1'>
                    <label className='text-xs font-black text-gray-400 uppercase tracking-widest'>Neural Key</label>
                    <AnimatePresence>
                      {errors.password && (
                        <motion.span
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className='text-[10px] font-bold text-red-500 uppercase flex items-center gap-1'
                        >
                          <AlertCircle size={10} /> {errors.password}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className='relative group'>
                    <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${errors.password ? 'text-red-500' : 'text-gray-400 group-focus-within:text-red-500'}`} />
                    <input
                      type='password'
                      name='password'
                      value={formDetails.password}
                      onChange={inputChange}
                      className={`w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-gray-800/50 border-2 rounded-2xl outline-none transition-all dark:text-white font-medium ${errors.password ? 'border-red-500' : 'border-transparent focus:border-red-600 dark:focus:border-red-600/50 hover:bg-white dark:hover:bg-gray-800'}`}
                      placeholder='••••••••'
                    />
                  </div>
                </div>

                <div className='flex items-center justify-between px-1'>
                  <NavLink
                    to='/forgot-password'
                    className='text-xs font-black text-gray-400 uppercase hover:text-red-600 transition-colors'
                  >
                    Reset Lost Key?
                  </NavLink>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(239, 68, 68, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  type='submit'
                  disabled={isLoading}
                  className={`w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <div className='w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin' />
                  ) : (
                    <>
                      INITIATE LINK
                      <ArrowRight className='w-6 h-6' />
                    </>
                  )}
                </motion.button>
              </form>

              <div className='mt-12 text-center pt-8 border-t border-gray-100 dark:border-gray-800'>
                <p className='text-gray-500 dark:text-gray-400 font-medium'>
                  No clearance yet?{' '}
                  <NavLink
                    to='/register'
                    className='text-red-600 font-black uppercase tracking-wider ml-2 hover:text-red-500 transition-colors'
                  >
                    Request Access
                  </NavLink>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Login


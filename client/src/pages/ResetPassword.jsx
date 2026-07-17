import { motion } from 'framer-motion'
import { ArrowRight, Brain, Lock, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { password, confirmPassword } = formData

      if (!password || !confirmPassword) {
        toast.error('Please fill in all fields')
        return
      }

      if (password.length < 5) {
        toast.error('Password must be at least 5 characters long')
        return
      }

      if (password !== confirmPassword) {
        toast.error('Passwords do not match')
        return
      }

      // Here you would typically make an API call to update the password
      toast.success('Password reset successfully!')
      navigate('/login')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-pink-50 pt-20 px-4 relative overflow-hidden'
      >
        {/* Animated background elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className='absolute top-1/4 -left-48 w-96 h-96 bg-green-200 rounded-full blur-3xl'
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className='absolute bottom-1/4 -right-48 w-96 h-96 bg-green-200 rounded-full blur-3xl'
        />

        <div className='max-w-md mx-auto relative z-10'>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
          >
            {/* Header */}
            <div className='relative h-48 bg-gradient-to-r from-green-500 to-green-500 flex items-center justify-center overflow-hidden'>
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className='absolute inset-0 opacity-30'
              >
                <div className='grid grid-cols-8 gap-4 transform rotate-12 scale-150'>
                  {Array.from({ length: 64 }).map((_, i) => (
                    <Sparkles key={i} className='text-white/20' size={16} />
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className='relative text-center'
              >
                <div className='flex justify-center'>
                  <Brain className='w-16 h-16 text-white' />
                </div>
                <h1 className='text-white text-3xl font-bold mt-4'>
                  New Password
                </h1>
                <p className='text-white/80 mt-2'>Choose a strong password</p>
              </motion.div>
            </div>

            {/* Form */}
            <div className='p-8'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    New Password
                  </label>
                  <div className='relative group'>
                    <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-green-500 transition-colors' />
                    <input
                      type='password'
                      name='password'
                      value={formData.password}
                      onChange={handleChange}
                      className='w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white/50 backdrop-blur-sm hover:bg-white'
                      placeholder='Enter new password'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    Confirm Password
                  </label>
                  <div className='relative group'>
                    <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-green-500 transition-colors' />
                    <input
                      type='password'
                      name='confirmPassword'
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className='w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white/50 backdrop-blur-sm hover:bg-white'
                      placeholder='Confirm new password'
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type='submit'
                  disabled={isLoading}
                  className={`w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-500 text-white rounded-xl font-medium 
                    flex items-center justify-center gap-2 hover:from-green-600 hover:to-green-600 transition-all
                    ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className='w-5 h-5' />
                    </>
                  )}
                </motion.button>
              </form>

              <div className='mt-6 space-y-2'>
                <div className='text-sm text-gray-600'>Password must:</div>
                <ul className='text-xs text-gray-500 space-y-1'>
                  <li className='flex items-center gap-2'>
                    <div
                      className={`w-1 h-1 rounded-full ${
                        formData.password.length >= 5
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                    Be at least 5 characters long
                  </li>
                  <li className='flex items-center gap-2'>
                    <div
                      className={`w-1 h-1 rounded-full ${
                        formData.password &&
                        formData.password === formData.confirmPassword
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                    Match confirmation password
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}

export default ResetPassword

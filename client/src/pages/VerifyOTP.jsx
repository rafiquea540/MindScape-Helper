import { motion } from 'framer-motion'
import { ArrowRight, Brain, Sparkles } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const VerifyOTP = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [otp, setOtp] = useState(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    if (!location.state?.email) {
      navigate('/forgot-password')
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [location.state, navigate])

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])

    if (element.nextSibling) {
      element.nextSibling.focus()
    }
  }

  const verifyOTPWithDelay = (enteredOTP) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(enteredOTP === '8430')
      }, 5000)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const enteredOTP = otp.join('')
      const isValid = await verifyOTPWithDelay(enteredOTP)

      if (isValid) {
        toast.success('OTP verified successfully!')
        navigate('/reset-password')
      } else {
        toast.error('Invalid OTP')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const resendOTP = () => {
    setTimeLeft(30)
    toast.success('OTP resent successfully!')
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
                  Verify OTP
                </h1>
                <p className='text-white/80 mt-2'>
                  Enter the code sent to your email
                </p>
              </motion.div>
            </div>

            {/* Form */}
            <div className='p-8'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='space-y-2'>
                  <div className='flex justify-center gap-4'>
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type='text'
                        maxLength='1'
                        value={data}
                        onChange={(e) => handleChange(e.target, index)}
                        onFocus={(e) => e.target.select()}
                        className='w-16 h-16 text-center text-2xl font-bold border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white/50 backdrop-blur-sm hover:bg-white'
                      />
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type='submit'
                  disabled={isLoading || otp.join('').length !== 4}
                  className={`w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-500 text-white rounded-xl font-medium 
                    flex items-center justify-center gap-2 hover:from-green-600 hover:to-green-600 transition-all
                    ${
                      isLoading || otp.join('').length !== 4
                        ? 'opacity-70 cursor-not-allowed'
                        : ''
                    }`}
                >
                  {isLoading ? (
                    <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  ) : (
                    <>
                      Verify OTP
                      <ArrowRight className='w-5 h-5' />
                    </>
                  )}
                </motion.button>
              </form>

              <div className='mt-8 text-center'>
                <p className='text-gray-600'>
                  Didn't receive the code?{' '}
                  {timeLeft > 0 ? (
                    <span className='text-gray-400'>Resend in {timeLeft}s</span>
                  ) : (
                    <button
                      onClick={resendOTP}
                      className='text-green-600 font-medium hover:text-green-700 transition-colors'
                    >
                      Resend OTP
                    </button>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}

export default VerifyOTP

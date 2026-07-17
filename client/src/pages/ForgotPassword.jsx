import axios from 'axios'
import { motion } from 'framer-motion'
import { ArrowRight, Brain, Mail, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { NavLink, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendOTPEmail = async (email) => {
    try {
      const response = await axios.post(
        'http://localhost:8800/api/email/send',
        {
          to: email,
          subject: 'Your Password Reset OTP Code',
          html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 20px 0; text-align: center; background-color: #22c55e;">
                  
                    <h1 style="margin: 0; color: white; font-size: 24px;">Password Reset Request</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 20px; background-color: white;">
                    <div style="max-width: 600px; margin: 0 auto;">
                      <p style="margin-bottom: 25px; color: #333; font-size: 16px;">Hello,</p>
                      
                      <p style="margin-bottom: 25px; color: #333; font-size: 16px;">We received a request to reset your password. Your One-Time Password (OTP) is:</p>
                      
                      <div style="background-color: #f8f8f8; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; color: #22c55e; letter-spacing: 8px;">8430</span>
                      </div>
                      
                      <p style="margin-bottom: 25px; color: #333; font-size: 16px;">This OTP will expire in 30 minutes for security reasons. If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
                      
                      <div style="margin: 40px 0; padding: 20px; background-color: #f8f8f8; border-radius: 8px;">
                        <p style="margin: 0; color: #666; font-size: 14px;">Security Tips:</p>
                        <ul style="color: #666; font-size: 14px; margin: 10px 0;">
                          <li>Never share your OTP with anyone</li>
                          <li>Our team will never ask for your OTP</li>
                          <li>Make sure to use a strong password</li>
                        </ul>
                      </div>
                      
                      <p style="margin-bottom: 25px; color: #333; font-size: 16px;">If you have any questions, feel free to contact our support team.</p>
                      
                      <p style="margin-bottom: 10px; color: #333; font-size: 16px;">Best regards,</p>
                      <p style="margin: 0; color: #333; font-size: 16px;">The MindScape Team</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; text-align: center; background-color: #f8f8f8;">
                    <p style="margin: 0; color: #666; font-size: 14px;">© ${new Date().getFullYear()} Straumann Group. All rights reserved.</p>
                    <p style="margin: 10px 0 0; color: #666; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
        }
      )
      return response.data
    } catch (error) {
      console.error('Error sending email:', error)
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!email) {
        toast.error('Please enter your email')
        return
      }

      // Send OTP email
      await toast.promise(sendOTPEmail(email), {
        loading: 'Sending OTP...',
        success: 'OTP sent successfully!',
        error: 'Failed to send OTP',
      })

      // Store email in session storage for verification
      sessionStorage.setItem('resetEmail', email)

      // Navigate to OTP verification page
      navigate('/verify', { state: { email } })
    } catch (error) {
      console.error(error)
      toast.error('Failed to send OTP')
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
                  Reset Password
                </h1>
                <p className='text-white/80 mt-2'>
                  We'll send you an OTP to reset
                </p>
              </motion.div>
            </div>

            {/* Form */}
            <div className='p-8'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700'>
                    Email
                  </label>
                  <div className='relative group'>
                    <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-green-500 transition-colors' />
                    <input
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white/50 backdrop-blur-sm hover:bg-white'
                      placeholder='Enter your email'
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
                      Send OTP
                      <ArrowRight className='w-5 h-5' />
                    </>
                  )}
                </motion.button>
              </form>

              <div className='mt-8 text-center'>
                <p className='text-gray-600'>
                  Remember your password?{' '}
                  <NavLink
                    to='/login'
                    className='text-green-600 font-medium hover:text-green-700 transition-colors'
                  >
                    Sign in
                  </NavLink>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}

export default ForgotPassword

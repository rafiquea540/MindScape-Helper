import axios from 'axios'
import { motion } from 'framer-motion'
import { BriefcaseMedical, DollarSign, Send, Stethoscope } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const FormField = ({
  icon: Icon,
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  error,
}) => (
  <div className='space-y-2'>
    <label className='text-sm font-medium text-gray-700'>{label}</label>
    <div className='relative group'>
      <Icon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors' />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-12 pr-4 py-3 bg-white border rounded-xl outline-none transition-all
          ${
            error
              ? 'border-red-300 focus:ring-2 focus:ring-red-500'
              : 'border-gray-200 focus:ring-2 focus:ring-green-500'
          }
          hover:border-gray-300`}
      />
      {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  </div>
)

const ApplyDoctor = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formDetails, setFormDetails] = useState({
    specialization: '',
    experience: '',
    fees: '',
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formDetails.specialization.trim()) {
      newErrors.specialization = 'Specialization is required'
    }

    if (!formDetails.experience) {
      newErrors.experience = 'Experience is required'
    } else if (formDetails.experience < 0) {
      newErrors.experience = 'Experience cannot be negative'
    }

    if (!formDetails.fees) {
      newErrors.fees = 'Fees is required'
    } else if (formDetails.fees < 0) {
      newErrors.fees = 'Fees cannot be negative'
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await toast.promise(
        axios.post(
          'http://localhost:8800/api/doctor/applyfordoctor',
          {
            formDetails,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        ),
        {
          loading: 'Submitting your application...',
          success: 'Application submitted successfully! 🎉',
          error: 'Failed to submit application. Please try again.',
        }
      )
      navigate('/')
    } catch (error) {
      console.error('Application error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='max-w-lg mx-auto pt-12'
        >
          <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
            {/* Header */}
            <div className='bg-gradient-to-r from-green-500 to-green-600 px-6 py-8'>
              <div className='flex items-center justify-center'>
                <div className='bg-white/10 p-3 rounded-xl'>
                  <BriefcaseMedical className='w-8 h-8 text-white' />
                </div>
              </div>
              <h2 className='mt-4 text-center text-2xl font-bold text-white'>
                Doctor Application
              </h2>
              <p className='mt-1 text-center text-green-100'>
                Join our network of healthcare professionals
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='p-6 space-y-6'>
              <FormField
                icon={Stethoscope}
                label='Specialization'
                name='specialization'
                type='text'
                value={formDetails.specialization}
                onChange={inputChange}
                placeholder='e.g., Cardiology, Pediatrics'
                error={errors.specialization}
              />

              <FormField
                icon={BriefcaseMedical}
                label='Years of Experience'
                name='experience'
                type='number'
                value={formDetails.experience}
                onChange={inputChange}
                placeholder='Enter years of experience'
                error={errors.experience}
              />

              <FormField
                icon={DollarSign}
                label='Consultation Fees'
                name='fees'
                type='number'
                value={formDetails.fees}
                onChange={inputChange}
                placeholder='Enter consultation fees'
                error={errors.fees}
              />

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type='submit'
                disabled={isSubmitting}
                className={`w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 
                  text-white rounded-xl font-medium flex items-center justify-center gap-2
                  hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-70
                  disabled:cursor-not-allowed shadow-lg shadow-green-500/20`}
              >
                {isSubmitting ? (
                  <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin' />
                ) : (
                  <>
                    <Send className='w-5 h-5' />
                    Submit Application
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  )
}

export default ApplyDoctor

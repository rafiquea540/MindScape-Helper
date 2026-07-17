import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Loader2,
  Lock,
  Mail,
  User,
  Shield,
  Zap,
  Cpu,
  Fingerprint,
  Activity,
  AlertCircle
} from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { NavLink, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const ValidationRule = ({ satisfied, text }) => (
  <motion.div
    layout
    className='flex items-center gap-3 text-xs font-bold uppercase tracking-wider transition-all duration-300'
  >
    <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${satisfied ? 'bg-red-500 border-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-transparent border-gray-300 dark:border-gray-700 text-transparent'}`}>
      <CheckCircle2 className='w-3 h-3' />
    </div>
    <span className={satisfied ? 'text-red-600 dark:text-red-400' : 'text-gray-400 dark:text-gray-600'}>
      {text}
    </span>
  </motion.div>
)

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [activeField, setActiveField] = useState('')
  const [formDetails, setFormDetails] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confpassword: '',
  })

  const [validationRules, setValidationRules] = useState({
    firstname: { minLength: false, validChars: false, noNumbers: false },
    lastname: { minLength: false, validChars: false, noNumbers: false },
    email: { validFormat: false, hasAtSymbol: false, hasDomain: false },
    password: { minLength: false, hasUpperCase: false, hasLowerCase: false, hasNumber: false, hasSpecialChar: false },
  })

  const [errors, setErrors] = useState({})

  const validateEmail = (email) => {
    const hasAtSymbol = email.includes('@')
    const hasDomain = email.includes('.') && email.split('.')[1]?.length >= 2
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const validFormat = emailRegex.test(email)

    setValidationRules((prev) => ({
      ...prev,
      email: { validFormat, hasAtSymbol, hasDomain },
    }))

    return validFormat
  }

  const validateName = (name, field) => {
    const minLength = name.length >= 2
    const validChars = /^[a-zA-Z\s'-]+$/.test(name)
    const noNumbers = !/\d/.test(name)

    setValidationRules((prev) => ({
      ...prev,
      [field]: { minLength, validChars, noNumbers },
    }))

    return minLength && validChars && noNumbers
  }

  const validatePassword = (password) => {
    const minLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    setValidationRules((prev) => ({
      ...prev,
      password: { minLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar },
    }))

    return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
  }

  const validateField = (name, value) => {
    let error = ''
    switch (name) {
      case 'firstname':
      case 'lastname':
        if (!validateName(value, name)) error = 'Invalid string format'
        break
      case 'email':
        if (!validateEmail(value)) error = 'Digital address mismatch'
        break
      case 'password':
        if (!validatePassword(value)) error = 'Complexity requirements not met'
        break
      case 'confpassword':
        if (value !== formDetails.password) error = 'Key sync failure'
        break
      default:
        break
    }
    return error
  }

  const inputChange = (e) => {
    const { name, value } = e.target
    setFormDetails((prev) => ({ ...prev, [name]: value }))

    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))

    if (name === 'password' && formDetails.confpassword) {
      setErrors((prev) => ({
        ...prev,
        confpassword: value !== formDetails.confpassword ? 'Key sync failure' : ''
      }))
    }
  }

  const formSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    const newErrors = {}
    Object.keys(formDetails).forEach(field => {
      const error = validateField(field, formDetails[field])
      if (error) newErrors[field] = error
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Validation parameters not satisfied')
      return
    }

    try {
      setLoading(true)
      const { firstname, lastname, email, password } = formDetails

      await toast.promise(
        axios.post('http://localhost:8800/api/user/register', {
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
        {
          loading: 'Provisioning neural profile...',
          success: 'Profile established successfully!',
          error: (err) => err.response?.data?.message || 'Protocol termination: Registration failed',
        }
      )

      navigate('/login')
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
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
        <div className='absolute top-20 right-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full' />
        <div className='absolute bottom-20 left-[-10%] w-[40%] h-[40%] bg-orange-600/5 blur-[120px] rounded-full' />

        <div className='max-w-2xl w-full relative z-10'>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className='bg-white/80 dark:bg-gray-900/50 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden'
          >
            {/* Design Header */}
            <div className='relative p-8 text-center border-b border-gray-100 dark:border-gray-800 bg-gradient-to-b from-red-50 to-transparent dark:from-red-950/10'>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className='inline-flex p-3 bg-red-600 rounded-2xl shadow-[0_0_15px_rgba(239,68,68,0.4)] mb-4'
              >
                <Fingerprint className='w-8 h-8 text-white' />
              </motion.div>
              <h1 className='text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase'>
                Request <span className='text-red-600'>Clearance</span>
              </h1>
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium'>
                Initialize your cognitive identity on the Nexus
              </p>
            </div>

            <div className='p-8 md:p-12'>
              <form onSubmit={formSubmit} className='space-y-8'>

                {/* Identity Cluster */}
                <div className='grid md:grid-cols-2 gap-8'>
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Given Name</label>
                      <AnimatePresence>
                        {errors.firstname && (
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-[10px] font-bold text-red-500 uppercase flex items-center gap-1'>
                            <AlertCircle size={10} /> {errors.firstname}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className='relative group'>
                      <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-500' />
                      <input
                        type='text' name='firstname' value={formDetails.firstname} onChange={inputChange}
                        onFocus={() => setActiveField('firstname')} onBlur={() => setActiveField('')}
                        className='w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-red-600 rounded-2xl outline-none transition-all dark:text-white font-medium text-sm'
                        placeholder='FIRST_NAME'
                      />
                    </div>
                    {activeField === 'firstname' && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className='p-4 bg-gray-100 dark:bg-gray-800/80 rounded-2xl space-y-2 border border-gray-200 dark:border-gray-700'>
                        <ValidationRule satisfied={validationRules.firstname.minLength} text='Min 2 units' />
                        <ValidationRule satisfied={validationRules.firstname.validChars} text='String-Alpha only' />
                      </motion.div>
                    )}
                  </div>

                  <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Family Name</label>
                      <AnimatePresence>
                        {errors.lastname && (
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-[10px] font-bold text-red-500 uppercase flex items-center gap-1'>
                            <AlertCircle size={10} /> {errors.lastname}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className='relative group'>
                      <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-500' />
                      <input
                        type='text' name='lastname' value={formDetails.lastname} onChange={inputChange}
                        onFocus={() => setActiveField('lastname')} onBlur={() => setActiveField('')}
                        className='w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-red-600 rounded-2xl outline-none transition-all dark:text-white font-medium text-sm'
                        placeholder='LAST_NAME'
                      />
                    </div>
                    {activeField === 'lastname' && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className='p-4 bg-gray-100 dark:bg-gray-800/80 rounded-2xl space-y-2 border border-gray-200 dark:border-gray-700'>
                        <ValidationRule satisfied={validationRules.lastname.minLength} text='Min 2 units' />
                        <ValidationRule satisfied={validationRules.lastname.validChars} text='String-Alpha only' />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Digital Address */}
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Digital Address</label>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-[10px] font-bold text-red-500 uppercase flex items-center gap-1'>
                          <AlertCircle size={10} /> {errors.email}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className='relative group'>
                    <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-500' />
                    <input
                      type='email' name='email' value={formDetails.email} onChange={inputChange}
                      onFocus={() => setActiveField('email')} onBlur={() => setActiveField('')}
                      className='w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-red-600 rounded-2xl outline-none transition-all dark:text-white font-medium text-sm'
                      placeholder='mail@pulse.io'
                    />
                  </div>
                  {activeField === 'email' && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className='p-4 bg-gray-100 dark:bg-gray-800/80 rounded-2xl space-y-2 border border-gray-200 dark:border-gray-700'>
                      <ValidationRule satisfied={validationRules.email.validFormat} text='Standard structure' />
                      <ValidationRule satisfied={validationRules.email.hasAtSymbol} text='Includes @' />
                    </motion.div>
                  )}
                </div>

                {/* Password Cluster */}
                <div className='grid md:grid-cols-2 gap-8'>
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Access Key</label>
                      <AnimatePresence>
                        {errors.password && (
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-[10px] font-bold text-red-500 uppercase flex items-center gap-1'>
                            <AlertCircle size={10} /> {errors.password}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className='relative group'>
                      <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-500' />
                      <input
                        type='password' name='password' value={formDetails.password} onChange={inputChange}
                        onFocus={() => setActiveField('password')} onBlur={() => setActiveField('')}
                        className='w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-red-600 rounded-2xl outline-none transition-all dark:text-white font-medium text-sm'
                        placeholder='••••••••'
                      />
                    </div>
                    {activeField === 'password' && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className='p-4 bg-gray-100 dark:bg-gray-800/80 rounded-2xl space-y-2 border border-gray-200 dark:border-gray-700'>
                        <ValidationRule satisfied={validationRules.password.minLength} text='Min 8 chars' />
                        <ValidationRule satisfied={validationRules.password.hasUpperCase} text='Uppercase' />
                        <ValidationRule satisfied={validationRules.password.hasNumber} text='Digit' />
                        <ValidationRule satisfied={validationRules.password.hasSpecialChar} text='Special char' />
                      </motion.div>
                    )}
                  </div>

                  <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Sync Key</label>
                      <AnimatePresence>
                        {errors.confpassword && (
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-[10px] font-bold text-red-500 uppercase flex items-center gap-1'>
                            <AlertCircle size={10} /> {errors.confpassword}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className='relative group'>
                      <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-500' />
                      <input
                        type='password' name='confpassword' value={formDetails.confpassword} onChange={inputChange}
                        onFocus={() => setActiveField('confpassword')} onBlur={() => setActiveField('')}
                        className='w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-red-600 rounded-2xl outline-none transition-all dark:text-white font-medium text-sm'
                        placeholder='••••••••'
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -10px rgba(239, 68, 68, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  type='submit'
                  disabled={loading}
                  className={`w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <Loader2 className='w-6 h-6 animate-spin' />
                  ) : (
                    <>
                      INITIALIZE PROFILE
                      <Zap size={20} />
                    </>
                  )}
                </motion.button>

                <div className='text-center'>
                  <p className='text-gray-500 dark:text-gray-400 font-bold text-xs uppercase'>
                    Already logged on the Nexus?{' '}
                    <NavLink to='/login' className='text-red-600 hover:text-red-500 transition-colors ml-2'>
                      Authenticate
                    </NavLink>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Register


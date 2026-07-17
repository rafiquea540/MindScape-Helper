import { motion } from 'framer-motion'
import {
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User,
} from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Form submitted:', formData)
      setFormData({ name: '', email: '', message: '' })
      toast.success('Your pulse has been received!')
    } catch (error) {
      toast.error('Connection failed. Please retry.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    { icon: Phone, text: '+92 313 7821430', label: 'Call Support' },
    { icon: Mail, text: 'connect@mindscape.ai', label: 'Direct Email' },
    { icon: MapPin, text: 'Islamabad, Digital Park', label: 'Main Hub' },
  ]

  return (
    <section className='relative overflow-hidden py-24 px-4 bg-white dark:bg-gray-950 transition-colors duration-300'>
      {/* Background Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px]' />
        <div className='absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px]' />
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='grid lg:grid-cols-2 gap-20 items-center'>
          {/* Contact Information */}
          <div className='max-w-xl'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='space-y-8'
            >
              <h2 className='text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight'>
                Experience the <span className='text-red-600 dark:text-red-500'>Future</span> of Support
              </h2>
              <p className='text-xl text-gray-600 dark:text-gray-400'>
                Have questions about our AI-driven mental health solutions? Our team is ready to assist you on your journey to peak mental wellness.
              </p>

              <div className='grid gap-6 pt-6'>
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className='flex items-center space-x-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm'
                  >
                    <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20'>
                      <item.icon className='w-6 h-6 text-white' />
                    </div>
                    <div>
                      <h3 className='text-sm font-bold text-red-600 dark:text-red-500 uppercase tracking-wider mb-1'>
                        {item.label}
                      </h3>
                      <p className='text-lg font-bold text-gray-900 dark:text-white'>
                        {item.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className='relative'
          >
            <div className='absolute -inset-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-[2.5rem] opacity-20 blur-2xl' />
            <div className='relative bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-800 backdrop-blur-xl'>
              <form onSubmit={handleSubmit} className='space-y-8'>
                <div className='grid sm:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <label className='text-sm font-bold text-gray-700 dark:text-gray-300 ml-2'>Full Identity</label>
                    <div className='relative group'>
                      <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors' />
                      <input
                        type='text' name='name' value={formData.name} onChange={handleChange}
                        className='w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-red-500 dark:focus:border-red-500/50 rounded-2xl outline-none transition-all dark:text-white dark:placeholder-gray-500 font-medium'
                        placeholder='Your name' required
                      />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-bold text-gray-700 dark:text-gray-300 ml-2'>Digital Address</label>
                    <div className='relative group'>
                      <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors' />
                      <input
                        type='email' name='email' value={formData.email} onChange={handleChange}
                        className='w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-red-500 dark:focus:border-red-500/50 rounded-2xl outline-none transition-all dark:text-white dark:placeholder-gray-500 font-medium'
                        placeholder='Your email' required
                      />
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-bold text-gray-700 dark:text-gray-300 ml-2'>Intelligence Pulse</label>
                  <div className='relative group'>
                    <MessageSquare className='absolute left-4 top-5 w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors' />
                    <textarea
                      name='message' value={formData.message} onChange={handleChange} rows='4'
                      className='w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-red-500 dark:focus:border-red-500/50 rounded-2xl outline-none transition-all dark:text-white dark:placeholder-gray-500 font-medium'
                      placeholder='Tell us your requirements...' required
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(239, 68, 68, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  type='submit'
                  disabled={isSubmitting}
                  className={`w-full py-5 px-8 bg-red-600 dark:bg-red-700 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${isSubmitting ? 'opacity-70' : ''}`}
                >
                  {isSubmitting ? (
                    <div className='w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin' />
                  ) : (
                    <>
                      <Send className='w-5 h-5' />
                      Initiate Contact
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact


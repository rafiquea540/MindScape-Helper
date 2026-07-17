import {
  Calendar,
  Camera,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
} from 'lucide-react'
import React, { useState } from 'react'
import Navbar from '../components/Navbar'

const Personalization = () => {
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div>
      <Navbar />
      <div className='mt-12 min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-3xl mx-auto'>
          {showSuccess && (
            <div className='mb-6 flex items-center gap-2 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg'>
              <CheckCircle className='h-5 w-5' />
              <p>Profile updated successfully!</p>
            </div>
          )}

          <div className='bg-white rounded-2xl shadow-xl p-6 sm:p-8'>
            <div className='flex flex-col items-center mb-8'>
              <div className='relative'>
                <div className='w-32 h-32 rounded-full bg-green-100 flex items-center justify-center'>
                  <User size={48} className='text-green-600' />
                </div>
                <button className='absolute bottom-0 right-0 bg-green-600 p-2 rounded-full text-white hover:bg-green-700 transition-colors'>
                  <Camera size={20} />
                </button>
              </div>
              <h1 className='mt-4 text-2xl font-bold text-gray-800'>
                Edit Your Profile
              </h1>
              <p className='text-gray-600'>
                Personalize your Mindscape Helper experience
              </p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Full Name
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <User size={18} className='text-gray-400' />
                    </div>
                    <input
                      type='text'
                      className='pl-10 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500'
                      placeholder='John Doe'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Email
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <Mail size={18} className='text-gray-400' />
                    </div>
                    <input
                      type='email'
                      className='pl-10 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500'
                      placeholder='john@example.com'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Phone Number
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <Phone size={18} className='text-gray-400' />
                    </div>
                    <input
                      type='tel'
                      className='pl-10 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500'
                      placeholder='+1 (555) 000-0000'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Date of Birth
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <Calendar size={18} className='text-gray-400' />
                    </div>
                    <input
                      type='date'
                      className='pl-10 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500'
                    />
                  </div>
                </div>

                <div className='space-y-2 md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Address
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <MapPin size={18} className='text-gray-400' />
                    </div>
                    <input
                      type='text'
                      className='pl-10 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500'
                      placeholder='123 Mental Health Street'
                    />
                  </div>
                </div>

                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    About Me
                  </label>
                  <textarea
                    className='w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500'
                    rows='4'
                    placeholder='Tell us about yourself...'
                  />
                </div>
              </div>

              <div className='flex justify-end pt-4'>
                <button
                  type='submit'
                  className='flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors'
                >
                  <Save size={20} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Personalization

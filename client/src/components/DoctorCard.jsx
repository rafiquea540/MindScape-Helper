import { Award, Clock, DollarSign, MapPin, Phone, Star } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import BookAppointment from './BookAppointment'

const DoctorCard = ({ ele }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [token] = useState(localStorage.getItem('token') || '')

  const handleModal = () => {
    if (token === '') {
      return toast.error('Please log in to book an appointment')
    }
    setModalOpen(true)
  }

  return (
    <div className='max-w-sm rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-all duration-300'>
      {/* Card Header with Image */}
      <div className='relative'>
        <div className='absolute inset-0  z-10' />
        <img
          className='w-full h-48 object-cover object-center'
          src={
            ele?.userId?.profileImage ||
            'https://static.vecteezy.com/system/resources/previews/004/493/181/non_2x/hospital-building-for-healthcare-background-illustration-with-ambulance-car-doctor-patient-nurses-and-medical-clinic-exterior-free-vector.jpg'
          }
          alt="Doctor's office"
        />
      </div>

      {/* Card Content */}
      <div className='relative px-6 pt-0 pb-6'>
        {/* Profile Image */}
        <div className='absolute -top-16 left-6'>
          <div className='relative'>
            <img
              className='w-32 h-32 rounded-full border-4 border-white shadow-md object-cover'
              src='https://www.greenvvc.com/files/yucaipa_vet/placeholder-male.png'
              alt={`Dr. ${ele?.userId?.firstname} ${ele?.userId?.lastname}`}
            />
            <div className='absolute bottom-2 right-2 bg-green-500 rounded-full p-1.5 border-2 border-white'>
              <div className='w-2 h-2 rounded-full bg-white' />
            </div>
          </div>
        </div>

        {/* Doctor Info */}
        <div className='pt-16 mb-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-xl font-bold text-gray-800 pt-2'>
              Dr. {ele?.userId?.firstname} {ele?.userId?.lastname}
            </h3>
            <div className='flex items-center'>
              <Star className='w-4 h-4 text-yellow-400 fill-yellow-400' />
              <span className='ml-1 text-sm font-medium text-gray-600'>
                {ele?.rating || '4.8'}
              </span>
            </div>
          </div>
          <p className='text-sm text-green-600 font-semibold'>
            {ele?.specialization}
          </p>
          {ele?.location && (
            <div className='flex items-center mt-1 text-gray-500 text-sm'>
              <MapPin size={14} className='mr-1' />
              <span>{ele.location}</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className='space-y-2.5'>
          <div className='flex items-center text-gray-700'>
            <Award size={18} className='mr-2 text-green-500' />
            <span className='text-sm'>{ele?.experience} years experience</span>
          </div>
          <div className='flex items-center text-gray-700'>
            <DollarSign size={18} className='mr-2 text-green-500' />
            <span className='text-sm'>Rs. {ele?.fees} per consultation</span>
          </div>
        </div>

        {/* Available Slots Summary */}
        {ele?.availableSlots && (
          <div className='mt-4 p-2 bg-green-50 rounded-lg'>
            <div className='flex items-center text-green-700 text-sm'>
              <Clock size={16} className='mr-2' />
              <span>Next available: {ele.availableSlots[0]}</span>
            </div>
          </div>
        )}

        {/* Book Appointment Button */}
        <button
          onClick={handleModal}
          className='w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition duration-300 ease-in-out flex items-center justify-center'
        >
          <Clock size={18} className='mr-2' />
          Book Appointment
        </button>
      </div>

      {/* Booking Modal */}
      {modalOpen && (
        <BookAppointment
          setModalOpen={setModalOpen}
          doctorId={ele?.userId?._id}
          doctorName={`${ele?.userId?.firstname} ${ele?.userId?.lastname}`}
        />
      )}
    </div>
  )
}

export default DoctorCard

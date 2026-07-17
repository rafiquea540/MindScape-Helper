import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { Lock, Mail, MapPin, Phone, UserCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import fetchData from '../helper/apiCall'
import { setLoading } from '../redux/reducers/rootSlice'

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN

function Profile() {
  const { userId } = jwt_decode(localStorage.getItem('token'))
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.root)
  const [file, setFile] = useState('')
  const [formDetails, setFormDetails] = useState({
    firstname: '',
    lastname: '',
    email: '',
    age: '',
    mobile: '',
    gender: 'neither',
    address: '',
    password: '',
    confpassword: '',
  })

  const getUser = async () => {
    try {
      dispatch(setLoading(true))
      const temp = await fetchData(
        `http://localhost:8800/api/user/getuser/${userId}`
      )
      setFormDetails({
        ...temp,
        password: '',
        confpassword: '',
        mobile: temp.mobile === null ? '' : temp.mobile,
        age: temp.age === null ? '' : temp.age,
      })
      setFile(temp.pic)
      dispatch(setLoading(false))
    } catch (error) {
      console.error('Error fetching user data:', error)
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    getUser()
  }, [dispatch])

  const inputChange = (e) => {
    const { name, value } = e.target
    return setFormDetails({
      ...formDetails,
      [name]: value,
    })
  }

  const formSubmit = async (e) => {
    try {
      e.preventDefault()
      const {
        firstname,
        lastname,
        email,
        age,
        mobile,
        address,
        gender,
        password,
        confpassword,
      } = formDetails

      if (!email) {
        return toast.error('Email should not be empty')
      } else if (firstname.length < 3) {
        return toast.error('First name must be at least 3 characters long')
      } else if (lastname.length < 3) {
        return toast.error('Last name must be at least 3 characters long')
      } else if (password && password.length < 5) {
        return toast.error('Password must be at least 5 characters long')
      } else if (password !== confpassword) {
        return toast.error('Passwords do not match')
      }
      await toast.promise(
        axios.put(
          'http://localhost:8800/api/user/updateprofile',
          {
            firstname,
            lastname,
            age,
            mobile,
            address,
            gender,
            email,
            password,
          },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        ),
        {
          pending: 'Updating profile...',
          success: 'Profile updated successfully',
          error: 'Unable to update profile',
          loading: 'Updating profile...',
        }
      )

      setFormDetails({ ...formDetails, password: '', confpassword: '' })
    } catch (error) {
      console.error('Error updating profile:', error)
      return toast.error('Unable to update profile')
    }
  }

  return (
    <>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <section className='mt-10 min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden'>
            <div className='bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 text-center'>
              <h2 className='text-3xl font-bold text-white mb-4'>
                Your Profile
              </h2>
              <img
                src='https://www.flagler.edu/themes/custom/flagler/images/person-placeholder-slide.webp'
                alt='profile'
                className='w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg'
              />
            </div>
            <form onSubmit={formSubmit} className='px-6 py-8 space-y-6'>
              <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2'>
                <div>
                  <label
                    htmlFor='firstname'
                    className='block text-sm font-medium text-gray-700'
                  >
                    First Name
                  </label>
                  <div className='mt-1 relative rounded-md shadow-sm'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <UserCircle
                        className='h-5 w-5 text-gray-400'
                        aria-hidden='true'
                      />
                    </div>
                    <input
                      type='text'
                      name='firstname'
                      id='firstname'
                      className='focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md'
                      placeholder='Enter your first name'
                      value={formDetails.firstname}
                      onChange={inputChange}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor='lastname'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Last Name
                  </label>
                  <div className='mt-1 relative rounded-md shadow-sm'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <UserCircle
                        className='h-5 w-5 text-gray-400'
                        aria-hidden='true'
                      />
                    </div>
                    <input
                      type='text'
                      name='lastname'
                      id='lastname'
                      className='focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md'
                      placeholder='Enter your last name'
                      value={formDetails.lastname}
                      onChange={inputChange}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Email
                  </label>
                  <div className='mt-1 relative rounded-md shadow-sm'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <Mail
                        className='h-5 w-5 text-gray-400'
                        aria-hidden='true'
                      />
                    </div>
                    <input
                      type='email'
                      name='email'
                      id='email'
                      className='focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md'
                      placeholder='Enter your email'
                      value={formDetails.email}
                      onChange={inputChange}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor='gender'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Gender
                  </label>
                  <select
                    name='gender'
                    id='gender'
                    className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
                    value={formDetails.gender}
                    onChange={inputChange}
                  >
                    <option value='neither'>Prefer not to say</option>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor='age'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Age
                  </label>
                  <input
                    type='text'
                    name='age'
                    id='age'
                    className='mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                    placeholder='Enter your age'
                    value={formDetails.age}
                    onChange={inputChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor='mobile'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Mobile
                  </label>
                  <div className='mt-1 relative rounded-md shadow-sm'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <Phone
                        className='h-5 w-5 text-gray-400'
                        aria-hidden='true'
                      />
                    </div>
                    <input
                      type='text'
                      name='mobile'
                      id='mobile'
                      className='focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md'
                      placeholder='Enter your mobile number'
                      value={formDetails.mobile}
                      onChange={inputChange}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor='address'
                  className='block text-sm font-medium text-gray-700'
                >
                  Address
                </label>
                <div className='mt-1 relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none'>
                    <MapPin
                      className='h-5 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                  </div>
                  <textarea
                    name='address'
                    id='address'
                    rows='3'
                    className='focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md'
                    placeholder='Enter your address'
                    value={formDetails.address}
                    onChange={inputChange}
                  ></textarea>
                </div>
              </div>
              <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2'>
                <div>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Password
                  </label>
                  <div className='mt-1 relative rounded-md shadow-sm'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <Lock
                        className='h-5 w-5 text-gray-400'
                        aria-hidden='true'
                      />
                    </div>
                    <input
                      type='password'
                      name='password'
                      id='password'
                      className='focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md'
                      placeholder='Enter your password'
                      value={formDetails.password}
                      onChange={inputChange}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor='confpassword'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Confirm Password
                  </label>
                  <div className='mt-1 relative rounded-md shadow-sm'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <Lock
                        className='h-5 w-5 text-gray-400'
                        aria-hidden='true'
                      />
                    </div>
                    <input
                      type='password'
                      name='confpassword'
                      id='confpassword'
                      className='focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md'
                      placeholder='Confirm your password'
                      value={formDetails.confpassword}
                      onChange={inputChange}
                    />
                  </div>
                </div>
              </div>
              <div>
                <button
                  type='submit'
                  className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </>
  )
}

export default Profile

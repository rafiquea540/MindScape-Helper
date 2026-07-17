import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import fetchData from '../helper/apiCall'
import { setLoading } from '../redux/reducers/rootSlice'
import Empty from './Empty'
import Loading from './Loading'

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([])
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.root)

  const getAllDoctors = async () => {
    try {
      dispatch(setLoading(true))
      const temp = await fetchData(
        `http://localhost:8800/api/doctor/getalldoctors`
      )
      setDoctors(temp)
      dispatch(setLoading(false))
    } catch (error) {
      console.error('Error fetching doctors:', error)
      dispatch(setLoading(false))
    }
  }

  const deleteUser = async (userId) => {
    try {
      const confirm = window.confirm('Are you sure you want to delete?')
      if (confirm) {
        await toast.promise(
          axios.put(
            'http://localhost:8800/api/doctor/deletedoctor',
            { userId },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          ),
          {
            success: 'Doctor deleted successfully',
            error: 'Unable to delete Doctor',
            loading: 'Deleting Doctor...',
          }
        )
        getAllDoctors()
      }
    } catch (error) {
      console.error('Error deleting doctor:', error)
      return error
    }
  }

  useEffect(() => {
    getAllDoctors()
  }, [])

  return (
    <div className='ml-16 md:ml-64 min-h-screen '>
      <div className='p-4 md:p-6'>
        <div className='bg-white rounded-lg shadow-md w-full'>
          <div className='p-4 md:p-6 border-b border-gray-200 flex justify-between items-center'>
            <h3 className='text-xl md:text-2xl font-bold text-gray-800'>
              All Doctors
            </h3>
            <div className='text-sm text-gray-600'>
              Total Doctors: {doctors.length}
            </div>
          </div>

          {loading ? (
            <div className='p-4 md:p-6'>
              <Loading />
            </div>
          ) : (
            <div className='w-full overflow-x-auto'>
              {doctors.length > 0 ? (
                <table className='w-full table-auto'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        S.No
                      </th>
                      <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Profile
                      </th>
                      <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        First Name
                      </th>
                      <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Last Name
                      </th>
                      <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Email
                      </th>
                      <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Mobile No.
                      </th>
                      <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Experience
                      </th>
                      <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Specialization
                      </th>
                      <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Fees
                      </th>
                      <th className='py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {doctors?.map((ele, i) => (
                      <tr key={ele?._id} className='hover:bg-gray-50'>
                        <td className='py-4 px-4 whitespace-nowrap text-sm text-gray-500'>
                          {i + 1}
                        </td>
                        <td className='py-4 px-4 whitespace-nowrap'>
                          <img
                            className='h-10 w-10 rounded-full object-cover border border-gray-200'
                            src='https://www.flagler.edu/themes/custom/flagler/images/person-placeholder-slide.webp'
                            alt={ele?.userId?.firstname}
                          />
                        </td>
                        <td className='py-4 px-4 whitespace-nowrap text-sm text-gray-900'>
                          {ele?.userId?.firstname}
                        </td>
                        <td className='py-4 px-4 whitespace-nowrap text-sm text-gray-900'>
                          {ele?.userId?.lastname}
                        </td>
                        <td className='py-4 px-4 whitespace-nowrap text-sm text-gray-500'>
                          {ele?.userId?.email}
                        </td>
                        <td className='py-4 px-4 whitespace-nowrap text-sm text-gray-500'>
                          {ele?.userId?.mobile}
                        </td>
                        <td className='py-4 px-4 whitespace-nowrap'>
                          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                            {ele?.experience} years
                          </span>
                        </td>
                        <td className='py-4 px-4 whitespace-nowrap'>
                          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
                            {ele?.specialization}
                          </span>
                        </td>
                        <td className='py-4 px-4 whitespace-nowrap'>
                          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                            Rs.{ele?.fees}
                          </span>
                        </td>
                        <td className='py-4 px-4 whitespace-nowrap'>
                          <button
                            onClick={() => deleteUser(ele?.userId?._id)}
                            className='inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-all duration-150'
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <Empty />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDoctors

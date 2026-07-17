import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import fetchData from '../helper/apiCall'
import { setLoading } from '../redux/reducers/rootSlice'
import Empty from './Empty'
import Loading from './Loading'

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.root)

  const getAllAppoint = async () => {
    try {
      dispatch(setLoading(true))
      const temp = await fetchData(
        `http://localhost:8800/api/appointment/getallappointments`
      )
      setAppointments(temp)
      dispatch(setLoading(false))
    } catch (error) {
      console.error('Error fetching appointments:', error)
      dispatch(setLoading(false))
    }
  }

  const complete = async (ele) => {
    try {
      await toast.promise(
        axios.put(
          'http://localhost:8800/api/appointment/completed',
          {
            appointid: ele?._id,
            doctorId: ele?.doctorId._id,
            doctorname: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        ),
        {
          success: 'Appointment completed successfully',
          error: 'Unable to complete appointment',
          loading: 'Completing appointment...',
        }
      )
      getAllAppoint()
    } catch (error) {
      console.error('Error completing appointment:', error)
      return error
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    getAllAppoint()
  }, [])

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col w-[calc(100%-16rem)] ml-64'>
      <div className='flex-1 p-4'>
        <div className='bg-white rounded-lg shadow-md'>
          <div className='p-6 border-b border-gray-200 flex justify-between items-center'>
            <h3 className='text-2xl font-bold text-gray-800'>
              All Appointments
            </h3>
            <div className='text-sm text-gray-600'>
              Total Appointments: {appointments.length}
            </div>
          </div>

          {loading ? (
            <div className='p-6'>
              <Loading />
            </div>
          ) : (
            <div className='w-full overflow-x-auto'>
              {appointments.length > 0 ? (
                <table className='w-full'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        S.No
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Doctor
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Patient
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Date
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Time
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Booked On
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Booked At
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Status
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {appointments?.map((ele, i) => (
                      <tr
                        key={ele?._id}
                        className='hover:bg-gray-50 transition-colors duration-150'
                      >
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {i + 1}
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-gray-900'>
                            {ele?.doctorId?.firstname +
                              ' ' +
                              ele?.doctorId?.lastname}
                          </div>
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-gray-900'>
                            {ele?.userId?.firstname +
                              ' ' +
                              ele?.userId?.lastname}
                          </div>
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {ele?.date}
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {ele?.time}
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {ele?.createdAt.split('T')[0]}
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {ele?.updatedAt.split('T')[1].split('.')[0]}
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap'>
                          <span
                            className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                              ele?.status
                            )}`}
                          >
                            {ele?.status}
                          </span>
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm'>
                          <button
                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition-all duration-150 ${
                              ele?.status === 'Completed'
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }`}
                            disabled={ele?.status === 'Completed'}
                            onClick={() => complete(ele)}
                          >
                            Complete
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

export default AdminAppointments

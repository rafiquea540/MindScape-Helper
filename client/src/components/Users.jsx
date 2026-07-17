import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import fetchData from '../helper/apiCall'
import { setLoading } from '../redux/reducers/rootSlice'
import Empty from './Empty'
import Loading from './Loading'

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN

const Users = () => {
  const [users, setUsers] = useState([])
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.root)

  const getAllUsers = async (e) => {
    try {
      dispatch(setLoading(true))
      const temp = await fetchData(`http://localhost:8800/api/user/getallusers`)
      setUsers(temp)
      dispatch(setLoading(false))
    } catch (error) {
      console.error('Error fetching users:', error)
      dispatch(setLoading(false))
    }
  }

  const deleteUser = async (userId) => {
    try {
      const confirm = window.confirm('Are you sure you want to delete?')
      if (confirm) {
        await toast.promise(
          axios.delete('http://localhost:8800/api/user/deleteuser', {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            data: { userId },
          }),
          {
            pending: 'Deleting in...',
            success: 'User deleted successfully',
            error: 'Unable to delete user',
            loading: 'Deleting user...',
          }
        )
        getAllUsers()
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      return error
    }
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className='p-6 ml-16 md:ml-64'>
          {' '}
          {/* Adjusted for sidebar */}
          <h3 className='text-2xl font-bold mb-4'>All Users</h3>
          {users.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='min-w-full bg-white'>
                <thead className='bg-gray-100'>
                  <tr>
                    <th className='py-2 px-4 border-b text-left'>S.No</th>
                    <th className='py-2 px-4 border-b text-left'>Pic</th>
                    <th className='py-2 px-4 border-b text-left'>First Name</th>
                    <th className='py-2 px-4 border-b text-left'>Last Name</th>
                    <th className='py-2 px-4 border-b text-left'>Email</th>
                    <th className='py-2 px-4 border-b text-left'>Mobile No.</th>
                    <th className='py-2 px-4 border-b text-left'>Age</th>
                    <th className='py-2 px-4 border-b text-left'>Gender</th>
                    <th className='py-2 px-4 border-b text-left'>Is Doctor</th>
                    <th className='py-2 px-4 border-b text-left'>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((ele, i) => (
                    <tr key={ele?._id} className='hover:bg-gray-50'>
                      <td className='py-2 px-4 border-b'>{i + 1}</td>
                      <td className='py-2 px-4 border-b'>
                        <img
                          className='w-10 h-10 rounded-full object-cover'
                          src='https://www.flagler.edu/themes/custom/flagler/images/person-placeholder-slide.webp'
                          alt={ele?.firstname}
                        />
                      </td>
                      <td className='py-2 px-4 border-b'>{ele?.firstname}</td>
                      <td className='py-2 px-4 border-b'>{ele?.lastname}</td>
                      <td className='py-2 px-4 border-b'>{ele?.email}</td>
                      <td className='py-2 px-4 border-b'>{ele?.mobile}</td>
                      <td className='py-2 px-4 border-b'>{ele?.age}</td>
                      <td className='py-2 px-4 border-b'>{ele?.gender}</td>
                      <td className='py-2 px-4 border-b'>
                        {ele?.isDoctor ? 'Yes' : 'No'}
                      </td>
                      <td className='py-2 px-4 border-b'>
                        <button
                          className='bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm'
                          onClick={() => deleteUser(ele?._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </section>
      )}
    </>
  )
}

export default Users

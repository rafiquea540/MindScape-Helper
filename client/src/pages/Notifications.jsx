import { AnimatePresence, motion } from 'framer-motion'
import { Bell, BellRing, Eye } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Empty from '../components/Empty'
import Footer from '../components/Footer'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import fetchData from '../helper/apiCall'
import { setLoading } from '../redux/reducers/rootSlice'

const NotificationRow = ({ notification, index }) => {
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className='group hover:bg-green-50/50 cursor-pointer'
    >
      <td className='pl-6 py-4 whitespace-nowrap'>
        <div className='flex items-center'>
          <div
            className={`w-2 h-2 rounded-full ${
              index < 3 ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
        </div>
      </td>
      <td className='px-6 py-4'>
        <div className='flex items-center gap-4'>
          <p className='text-gray-800 line-clamp-2'>{notification.content}</p>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-500'>
          {getTimeAgo(notification.updatedAt)}
        </div>
      </td>
    </motion.tr>
  )
}

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.root)

  const getAllNotif = async () => {
    try {
      dispatch(setLoading(true))
      const temp = await fetchData(
        `http://localhost:8800/api/notification/getallnotifs`
      )
      setNotifications(temp)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    getAllNotif()
  }, [])

  const unreadCount = notifications.slice(0, 3).length

  return (
    <div className='min-h-screen bg-gray-50 pt-12'>
      <Navbar />
      <div className='max-w-5xl mx-auto px-4 py-8'>
        {loading ? (
          <Loading />
        ) : (
          <AnimatePresence>
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className='relative'
                  >
                    <div className='p-2 bg-white shadow-lg rounded-xl'>
                      <BellRing className='w-6 h-6 text-green-500' />
                    </div>
                    {unreadCount > 0 && (
                      <span className='absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs font-medium flex items-center justify-center rounded-full'>
                        {unreadCount}
                      </span>
                    )}
                  </motion.div>
                  <div>
                    <h1 className='text-xl font-bold text-gray-800'>
                      Notifications
                    </h1>
                    <p className='text-sm text-gray-500'>
                      {unreadCount} unread messages
                    </p>
                  </div>
                </div>
              </div>

              {notifications.length > 0 ? (
                <div className='bg-white shadow-xl rounded-2xl overflow-hidden'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='pl-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-4'></th>
                        <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Message
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Time
                        </th>
                        <th className='pr-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'></th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-100'>
                      {notifications.map((notification, index) => (
                        <NotificationRow
                          key={notification._id}
                          notification={notification}
                          index={index}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='flex flex-col items-center justify-center py-12 text-center'
                >
                  <div className='bg-white p-4 rounded-full shadow-lg mb-4'>
                    <Bell className='w-8 h-8 text-gray-400' />
                  </div>
                  <Empty />
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Notifications

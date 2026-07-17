import AgoraRTC from 'agora-rtc-sdk-ng'
import axios from 'axios'
import { motion } from 'framer-motion'
import jwt_decode from 'jwt-decode'
import {
  Calendar,
  CheckCircle,
  Clock,
  Mic,
  MicOff,
  Phone,
  User,
  Video,
  VideoOff,
  X,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import Empty from '../components/Empty'
import Footer from '../components/Footer'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import fetchData from '../helper/apiCall'
import { setLoading } from '../redux/reducers/rootSlice'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null)
  const [client, setClient] = useState(null)
  const [localVideoTrack, setLocalVideoTrack] = useState(null)
  const [localAudioTrack, setLocalAudioTrack] = useState(null)
  const [remoteVideoTrack, setRemoteVideoTrack] = useState(null)
  const [remoteAudioTrack, setRemoteAudioTrack] = useState(null)
  const [joined, setJoined] = useState(false)
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(false)

  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.root)
  const { userId } = jwt_decode(localStorage.getItem('token'))

  const appId = '37080ed6c17b47ddbe6d1c043f19bdb5'

  const getAllAppoint = async () => {
    try {
      dispatch(setLoading(true))
      const temp = await fetchData(
        `http://localhost:8800/api/appointment/getallappointments?search=${userId}`
      )
      setAppointments(temp)
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      toast.error('Error fetching appointments')
    }
  }

  useEffect(() => {
    getAllAppoint()
  }, [])

  const complete = async (ele) => {
    try {
      await toast.promise(
        axios.put(
          'http://localhost:8800/api/appointment/completed',
          {
            appointid: ele?._id,
            doctorId: ele?.doctorId?._id,
            doctorname: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        ),
        {
          success:
            'Appointment marked as completed. You can now join the video call.',
          error: 'Unable to update appointment',
          loading: 'Updating appointment status...',
        }
      )
      getAllAppoint()
    } catch (error) {
      return error
    }
  }

  // Video Call Functions
  useEffect(() => {
    if (!showVideoModal) return

    const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
    setClient(agoraClient)

    agoraClient.on('user-published', async (user, mediaType) => {
      await agoraClient.subscribe(user, mediaType)
      if (mediaType === 'video') {
        setRemoteVideoTrack(user.videoTrack)
      }
      if (mediaType === 'audio') {
        setRemoteAudioTrack(user.audioTrack)
        user.audioTrack.play()
      }
    })

    agoraClient.on('user-unpublished', (user, mediaType) => {
      if (mediaType === 'video') {
        setRemoteVideoTrack(null)
      }
      if (mediaType === 'audio') {
        setRemoteAudioTrack(null)
      }
    })

    return () => {
      localVideoTrack?.close()
      localAudioTrack?.close()
      client?.leave()
      setJoined(false)
      setLocalVideoTrack(null)
      setLocalAudioTrack(null)
      setRemoteVideoTrack(null)
      setRemoteAudioTrack(null)
    }
  }, [showVideoModal])

  const joinChannel = async () => {
    try {
      if (!client) return
      await client.join(
        appId,
        `appointment-${selectedAppointmentId}`,
        null,
        null
      )

      const [audioTrack, videoTrack] =
        await AgoraRTC.createMicrophoneAndCameraTracks()

      setLocalAudioTrack(audioTrack)
      setLocalVideoTrack(videoTrack)

      await client.publish([audioTrack, videoTrack])
      setJoined(true)

      toast.success('Successfully joined the call')
    } catch (error) {
      console.error('Error joining channel:', error)
      toast.error('Failed to join the call')
    }
  }

  const handleCloseVideo = async () => {
    try {
      localVideoTrack?.close()
      localAudioTrack?.close()
      await client?.leave()
      setShowVideoModal(false)
      setJoined(false)
      setSelectedAppointmentId(null)
    } catch (error) {
      console.error('Error leaving channel:', error)
    }
  }

  const toggleAudio = () => {
    if (localAudioTrack) {
      localAudioTrack.setEnabled(!isAudioMuted)
      setIsAudioMuted(!isAudioMuted)
    }
  }

  const toggleVideo = () => {
    if (localVideoTrack) {
      localVideoTrack.setEnabled(!isVideoMuted)
      setIsVideoMuted(!isVideoMuted)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isDoctor = userId === appointments[0]?.doctorId?._id
  const isPatient = !isDoctor

  const renderActionButtons = (ele) => {
    if (ele?.status === 'Completed') {
      return (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSelectedAppointmentId(ele?._id)
            setShowVideoModal(true)
          }}
          className='px-4 py-2 rounded-lg text-sm font-medium text-white
            bg-blue-500 hover:bg-blue-600 transition-colors shadow-sm
            flex items-center gap-2'
        >
          <Video className='w-4 h-4' />
          Join Call
        </motion.button>
      )
    }

    if (isDoctor && ele?.status !== 'Completed') {
      return (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => complete(ele)}
          className='px-4 py-2 rounded-lg text-sm font-medium text-white
            bg-green-500 hover:bg-green-600 transition-colors shadow-sm
            flex items-center gap-2'
        >
          <CheckCircle className='w-4 h-4' />
          Mark Complete
        </motion.button>
      )
    }

    return null
  }

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-gradient-to-b pt-10 from-green-50 to-white'>
        {loading ? (
          <Loading />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='container mx-auto px-4 py-8'
          >
            <h2 className='text-3xl font-bold text-gray-800 mb-8'>
              Your Appointments
            </h2>

            {appointments.length > 0 ? (
              <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
                {/* Desktop View */}
                <div className='hidden md:block overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='border-b border-gray-100 bg-gray-50/50'>
                        <th className='px-6 py-4 text-sm font-semibold text-gray-500 text-left'>
                          S.No
                        </th>
                        <th className='px-6 py-4 text-sm font-semibold text-gray-500 text-left'>
                          Doctor
                        </th>
                        <th className='px-6 py-4 text-sm font-semibold text-gray-500 text-left'>
                          Patient
                        </th>
                        <th className='px-6 py-4 text-sm font-semibold text-gray-500 text-left'>
                          Date & Time
                        </th>
                        <th className='px-6 py-4 text-sm font-semibold text-gray-500 text-left'>
                          Booking Info
                        </th>
                        <th className='px-6 py-4 text-sm font-semibold text-gray-500 text-left'>
                          Status
                        </th>
                        <th className='px-6 py-4 text-sm font-semibold text-gray-500 text-left'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                      {appointments?.map((ele, i) => (
                        <motion.tr
                          key={ele?._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className='hover:bg-gray-50/50 transition-colors'
                        >
                          <td className='px-6 py-4 text-sm text-gray-600'>
                            {i + 1}
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-2'>
                              <User className='w-4 h-4 text-green-500' />
                              <span className='text-sm text-gray-600'>
                                {ele?.doctorId?.firstname +
                                  ' ' +
                                  ele?.doctorId?.lastname}
                              </span>
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex items-center gap-2'>
                              <User className='w-4 h-4 text-green-500' />
                              <span className='text-sm text-gray-600'>
                                {ele?.userId?.firstname +
                                  ' ' +
                                  ele?.userId?.lastname}
                              </span>
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='space-y-1'>
                              <div className='flex items-center gap-2'>
                                <Calendar className='w-4 h-4 text-green-500' />
                                <span className='text-sm text-gray-600'>
                                  {ele?.date}
                                </span>
                              </div>
                              <div className='flex items-center gap-2'>
                                <Clock className='w-4 h-4 text-green-500' />
                                <span className='text-sm text-gray-600'>
                                  {ele?.time}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <div className='space-y-1'>
                              <div className='text-sm text-gray-600'>
                                Booked: {ele?.createdAt.split('T')[0]}
                              </div>
                              <div className='text-sm text-gray-600'>
                                Time:{' '}
                                {ele?.updatedAt.split('T')[1].split('.')[0]}
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4'>
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                ele?.status
                              )}`}
                            >
                              {ele?.status === 'Completed' && (
                                <CheckCircle className='w-3 h-3 mr-1' />
                              )}
                              {ele?.status}
                            </span>
                          </td>
                          <td className='px-6 py-4'>
                            {renderActionButtons(ele)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className='md:hidden divide-y divide-gray-100'>
                  {appointments?.map((ele, i) => (
                    <motion.div
                      key={ele?._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className='p-4 space-y-4'
                    >
                      <div className='flex justify-between items-start'>
                        <div className='space-y-1'>
                          <div className='text-sm font-medium text-gray-600'>
                            Appointment #{i + 1}
                          </div>
                          <div
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              ele?.status
                            )}`}
                          >
                            {ele?.status === 'Completed' && (
                              <CheckCircle className='w-3 h-3 mr-1' />
                            )}
                            {ele?.status}
                          </div>
                        </div>
                        {renderActionButtons(ele)}
                      </div>

                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <div className='text-xs text-gray-500 mb-1'>
                            Doctor
                          </div>
                          <div className='flex items-center gap-2'>
                            <User className='w-4 h-4 text-green-500' />
                            <span className='text-sm text-gray-600'>
                              {ele?.doctorId?.firstname +
                                ' ' +
                                ele?.doctorId?.lastname}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className='text-xs text-gray-500 mb-1'>
                            Patient
                          </div>
                          <div className='flex items-center gap-2'>
                            <User className='w-4 h-4 text-green-500' />
                            <span className='text-sm text-gray-600'>
                              {ele?.userId?.firstname +
                                ' ' +
                                ele?.userId?.lastname}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <div className='text-xs text-gray-500 mb-1'>
                            Date & Time
                          </div>
                          <div className='space-y-1'>
                            <div className='flex items-center gap-2'>
                              <Calendar className='w-4 h-4 text-green-500' />
                              <span className='text-sm text-gray-600'>
                                {ele?.date}
                              </span>
                            </div>
                            <div className='flex items-center gap-2'>
                              <Clock className='w-4 h-4 text-green-500' />
                              <span className='text-sm text-gray-600'>
                                {ele?.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className='text-xs text-gray-500 mb-1'>
                            Booking Info
                          </div>
                          <div className='space-y-1'>
                            <div className='text-sm text-gray-600'>
                              Booked: {ele?.createdAt.split('T')[0]}
                            </div>
                            <div className='text-sm text-gray-600'>
                              Time: {ele?.updatedAt.split('T')[1].split('.')[0]}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='flex justify-center'>
                <Empty />
              </div>
            )}

            {/* Video Call Modal */}
            {showVideoModal && (
              <div className='fixed inset-0 z-50'>
                <div className='absolute inset-0 backdrop-blur-sm' />
                <div className='relative h-screen flex items-center justify-center'>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className='bg-gray-900 rounded-xl shadow-2xl w-[90vw] h-[90vh] max-w-6xl overflow-hidden'
                  >
                    {/* Close Button */}
                    <div className='absolute top-4 right-4 z-10'>
                      <button
                        onClick={handleCloseVideo}
                        className='p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors'
                      >
                        <X className='w-6 h-6 text-white' />
                      </button>
                    </div>

                    {/* Video Container */}
                    <div className='relative w-full h-full'>
                      {/* Local Video */}
                      <div
                        className='w-full h-full bg-gray-900'
                        ref={(ref) => {
                          if (ref && localVideoTrack) {
                            localVideoTrack.play(ref)
                          }
                        }}
                      />

                      {/* User Label */}
                      <div className='absolute bottom-4 left-4 flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg'>
                        <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
                        <span className='text-white text-sm font-medium'>
                          {isDoctor ? 'You (Doctor)' : 'You (Patient)'}
                        </span>
                      </div>

                      {/* Video Muted Overlay */}
                      {isVideoMuted && (
                        <div className='absolute inset-0 flex items-center justify-center bg-gray-900/90'>
                          <VideoOff className='w-16 h-16 text-white/40' />
                        </div>
                      )}

                      {/* Remote Video PiP */}
                      {remoteVideoTrack && (
                        <div className='absolute top-4 right-16 w-64 h-48 rounded-lg overflow-hidden shadow-lg'>
                          <div
                            className='w-full h-full bg-gray-800'
                            ref={(ref) => {
                              if (ref && remoteVideoTrack) {
                                remoteVideoTrack.play(ref)
                              }
                            }}
                          />
                          <div className='absolute bottom-2 left-2 flex items-center gap-2 bg-black/30 px-2 py-1 rounded-lg'>
                            <div className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse' />
                            <span className='text-white text-xs font-medium'>
                              {isDoctor ? 'Patient' : 'Doctor'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Video Controls */}
                      <div className='absolute bottom-0 left-0 right-0 p-6 flex justify-center items-center bg-gradient-to-t from-black/50 to-transparent'>
                        {!joined ? (
                          <button
                            onClick={joinChannel}
                            className='bg-green-500 hover:bg-green-600 active:bg-green-700 text-white 
                              px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-all
                              transform hover:scale-105 active:scale-95'
                          >
                            <Phone className='w-5 h-5' />
                            Join Consultation
                          </button>
                        ) : (
                          <div className='flex items-center gap-4'>
                            <button
                              onClick={toggleAudio}
                              className={`p-4 rounded-xl ${
                                isAudioMuted
                                  ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              } transition-all transform hover:scale-105 active:scale-95`}
                            >
                              {isAudioMuted ? (
                                <MicOff className='w-6 h-6' />
                              ) : (
                                <Mic className='w-6 h-6' />
                              )}
                            </button>

                            <button
                              onClick={toggleVideo}
                              className={`p-4 rounded-xl ${
                                isVideoMuted
                                  ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              } transition-all transform hover:scale-105 active:scale-95`}
                            >
                              {isVideoMuted ? (
                                <VideoOff className='w-6 h-6' />
                              ) : (
                                <Video className='w-6 h-6' />
                              )}
                            </button>

                            <button
                              onClick={handleCloseVideo}
                              className='bg-red-500 hover:bg-red-600 active:bg-red-700 text-white 
                                px-8 py-4 rounded-xl font-medium flex items-center gap-2
                                transition-all transform hover:scale-105 active:scale-95'
                            >
                              <Phone className='w-6 h-6 rotate-225' />
                              End Call
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default Appointments

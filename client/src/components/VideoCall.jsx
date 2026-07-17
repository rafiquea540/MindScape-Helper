import AgoraRTC from 'agora-rtc-sdk-ng'
import { motion } from 'framer-motion'
import { Mic, MicOff, Phone, Video, VideoOff, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const VideoCallModal = ({ isOpen, onClose, channelName, role }) => {
  const [localVideoTrack, setLocalVideoTrack] = useState(null)
  const [localAudioTrack, setLocalAudioTrack] = useState(null)
  const [remoteVideoTrack, setRemoteVideoTrack] = useState(null)
  const [remoteAudioTrack, setRemoteAudioTrack] = useState(null)
  const [joined, setJoined] = useState(false)
  const [client, setClient] = useState(null)
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(false)

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  const appId = '37080ed6c17b47ddbe6d1c043f19bdb5'

  useEffect(() => {
    if (!isOpen) return

    console.log('Initializing Agora client')
    const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
    setClient(agoraClient)

    agoraClient.on('user-published', async (user, mediaType) => {
      console.log('Remote user published:', mediaType)
      await agoraClient.subscribe(user, mediaType)

      if (mediaType === 'video') {
        console.log('Setting up remote video')
        setRemoteVideoTrack(user.videoTrack)
        if (remoteVideoRef.current) {
          user.videoTrack.play(remoteVideoRef.current)
        }
      }
      if (mediaType === 'audio') {
        console.log('Setting up remote audio')
        setRemoteAudioTrack(user.audioTrack)
        user.audioTrack.play()
      }
    })

    agoraClient.on('user-unpublished', (user, mediaType) => {
      console.log('User unpublished:', mediaType)
      if (mediaType === 'video') {
        setRemoteVideoTrack(null)
      }
      if (mediaType === 'audio') {
        setRemoteAudioTrack(null)
      }
    })

    return () => {
      console.log('Cleaning up...')
      localVideoTrack?.stop()
      localVideoTrack?.close()
      localAudioTrack?.stop()
      localAudioTrack?.close()
      client?.leave()
    }
  }, [isOpen])

  const joinChannel = async () => {
    try {
      console.log('Attempting to join channel...')
      if (!client) {
        console.error('No client available')
        return
      }

      await client.join(appId, channelName, null, null)
      console.log('Joined channel successfully')

      console.log('Creating audio and video tracks...')
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack()
      const videoTrack = await AgoraRTC.createCameraVideoTrack()

      setLocalAudioTrack(audioTrack)
      setLocalVideoTrack(videoTrack)

      if (localVideoRef.current) {
        console.log('Playing local video')
        videoTrack.play(localVideoRef.current)
      }

      console.log('Publishing tracks...')
      await client.publish([audioTrack, videoTrack])

      setJoined(true)
      toast.success('Successfully joined the call')
    } catch (error) {
      console.error('Error joining channel:', error)
      toast.error('Failed to join the call')
    }
  }

  const handleClose = async () => {
    try {
      console.log('Closing call...')
      localVideoTrack?.stop()
      localVideoTrack?.close()
      localAudioTrack?.stop()
      localAudioTrack?.close()
      await client?.leave()

      setJoined(false)
      setLocalVideoTrack(null)
      setLocalAudioTrack(null)
      setRemoteVideoTrack(null)
      setRemoteAudioTrack(null)
      onClose()
    } catch (error) {
      console.error('Error leaving channel:', error)
    }
  }

  const toggleAudio = () => {
    try {
      console.log('Toggling audio:', !isAudioMuted)
      if (localAudioTrack) {
        localAudioTrack.setMuted(!isAudioMuted)
        setIsAudioMuted(!isAudioMuted)
      }
    } catch (error) {
      console.error('Error toggling audio:', error)
    }
  }

  const toggleVideo = () => {
    try {
      console.log('Toggling video:', !isVideoMuted)
      if (localVideoTrack) {
        localVideoTrack.setMuted(!isVideoMuted)
        setIsVideoMuted(!isVideoMuted)
      }
    } catch (error) {
      console.error('Error toggling video:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='fixed inset-0 bg-black/70 backdrop-blur-sm'
        onClick={handleClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className='relative bg-gray-900 rounded-xl shadow-2xl w-[90vw] h-[90vh] max-w-6xl overflow-hidden'
      >
        <div className='absolute top-4 right-4 z-10'>
          <button
            onClick={handleClose}
            className='p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors'
          >
            <X className='w-6 h-6 text-white' />
          </button>
        </div>

        <div className='relative w-full h-full'>
          <div ref={localVideoRef} className='w-full h-full bg-gray-900' />

          <div className='absolute bottom-4 left-4 flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg'>
            <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
            <span className='text-white text-sm font-medium'>You ({role})</span>
          </div>

          {isVideoMuted && (
            <div className='absolute inset-0 flex items-center justify-center bg-gray-900/90'>
              <Video className='w-16 h-16 text-white/40' />
            </div>
          )}

          {remoteVideoTrack && (
            <div className='absolute top-4 right-16 w-64 h-48 rounded-lg overflow-hidden shadow-lg'>
              <div ref={remoteVideoRef} className='w-full h-full bg-gray-800' />
              <div className='absolute bottom-2 left-2 flex items-center gap-2 bg-black/30 px-2 py-1 rounded-lg'>
                <div className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse' />
                <span className='text-white text-xs font-medium'>
                  {role === 'doctor' ? 'Patient' : 'Doctor'}
                </span>
              </div>
            </div>
          )}

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
                    <Video className='w-6 h-6' />
                  ) : (
                    <VideoOff className='w-6 h-6' />
                  )}
                </button>

                <button
                  onClick={handleClose}
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
  )
}

export default VideoCallModal

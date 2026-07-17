import {
  Activity,
  AlertCircle,
  Brain,
  Frown,
  Heart,
  Meh,
  Mic,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  Save,
  Smile,
  StopCircle,
  ThumbsDown,
  ThumbsUp,
  Waveform,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Navbar from '../components/Navbar'

// Custom Alert Component instead of shadcn
const CustomAlert = ({ title, description, variant = 'info' }) => {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  }

  return (
    <div className={`p-4 rounded-lg border ${variants[variant]}`}>
      {title && <h4 className='font-medium mb-1'>{title}</h4>}
      <p className='text-sm opacity-90'>{description}</p>
    </div>
  )
}

// Audio Analysis Utility Functions
const calculateRMS = (buffer) => {
  let sum = 0
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i]
  }
  return Math.sqrt(sum / buffer.length)
}

const calculateZeroCrossings = (buffer) => {
  let crossings = 0
  for (let i = 1; i < buffer.length; i++) {
    if (
      (buffer[i - 1] < 0 && buffer[i] >= 0) ||
      (buffer[i - 1] >= 0 && buffer[i] < 0)
    ) {
      crossings++
    }
  }
  return crossings
}

const calculateSpectralCentroid = (spectrum) => {
  let sumOfWeightedMagnitudes = 0
  let sumOfMagnitudes = 0
  for (let i = 0; i < spectrum.length; i++) {
    const magnitude = Math.abs(spectrum[i])
    sumOfWeightedMagnitudes += i * magnitude
    sumOfMagnitudes += magnitude
  }
  return sumOfMagnitudes === 0 ? 0 : sumOfWeightedMagnitudes / sumOfMagnitudes
}

// Enhanced emotion categories with more nuanced detection criteria
const EMOTIONS = {
  HAPPY: {
    name: 'Happy',
    icon: <Smile className='w-6 h-6' />,
    color: 'text-green-500',
    features: {
      pitch: 'high',
      energy: 'high',
      tempo: 'moderate to fast',
      spectrum: '2000-8000 Hz',
    },
  },
  SAD: {
    name: 'Sad',
    icon: <Frown className='w-6 h-6' />,
    color: 'text-blue-500',
    features: {
      pitch: 'low',
      energy: 'low',
      tempo: 'slow',
      spectrum: '100-1000 Hz',
    },
  },
  ANGRY: {
    name: 'Angry',
    icon: <AlertCircle className='w-6 h-6' />,
    color: 'text-red-500',
    features: {
      pitch: 'high',
      energy: 'very high',
      tempo: 'fast',
      spectrum: '500-4000 Hz',
    },
  },
  NEUTRAL: {
    name: 'Neutral',
    icon: <Meh className='w-6 h-6' />,
    color: 'text-gray-500',
    features: {
      pitch: 'medium',
      energy: 'moderate',
      tempo: 'moderate',
      spectrum: '1000-3000 Hz',
    },
  },
}

const EmotionContextPage = () => {
  // State management
  const [audioState, setAudioState] = useState({
    isRecording: false,
    audioBlob: null,
    recordings: [],
    recordingTime: 0,
    audioLevel: 0,
  })

  const [analysisState, setAnalysisState] = useState({
    currentEmotion: null,
    confidence: 0,
    emotionalData: [],
    features: {
      pitch: 0,
      energy: 0,
      tempo: 0,
      formants: [],
    },
    isAnalyzing: false,
    error: null,
  })

  // Technical refs
  const audioRefs = {
    context: useRef(null),
    analyser: useRef(null),
    mediaRecorder: useRef(null),
    audioChunks: useRef([]),
    processorNode: useRef(null),
    microphoneStream: useRef(null),
  }

  // Initialize Web Audio API with advanced processing
  useEffect(() => {
    const initAudio = async () => {
      try {
        const context = new (window.AudioContext || window.webkitAudioContext)()
        audioRefs.context.current = context

        // Create and configure analyser node
        const analyser = context.createAnalyser()
        analyser.fftSize = 4096
        analyser.smoothingTimeConstant = 0.8
        audioRefs.analyser.current = analyser

        // Create script processor for audio analysis
        const scriptProcessor = context.createScriptProcessor(4096, 1, 1)
        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
          const inputBuffer = audioProcessingEvent.inputBuffer
          const inputData = inputBuffer.getChannelData(0)

          // Calculate audio features
          const energy = calculateRMS(inputData)
          const zeroCrossings = calculateZeroCrossings(inputData)
          const spectralData = new Float32Array(analyser.frequencyBinCount)
          analyser.getFloatFrequencyData(spectralData)
          const spectralCentroid = calculateSpectralCentroid(spectralData)

          // Update analysis state
          if (audioState.isRecording) {
            const features = {
              energy: energy * 100, // Scale to 0-100 range
              zeroCrossings,
              spectralCentroid,
            }

            const emotionResult = detectEmotion(features)

            // Throttle updates to every 200ms to prevent too many rerenders
            const now = Date.now()
            if (!audioRefs.lastUpdate || now - audioRefs.lastUpdate >= 200) {
              audioRefs.lastUpdate = now

              setAnalysisState((prev) => {
                // Keep only last 50 data points for performance
                const newEmotionalData = [
                  ...prev.emotionalData.slice(-49),
                  {
                    time: new Date().toLocaleTimeString(),
                    emotion: emotionResult.emotion,
                    intensity: features.energy,
                    confidence: emotionResult.confidence,
                    frequency: features.zeroCrossings / 100, // Normalize for display
                  },
                ]

                return {
                  ...prev,
                  currentEmotion: emotionResult.emotion,
                  confidence: emotionResult.confidence,
                  features: {
                    energy: features.energy,
                    pitch: features.zeroCrossings / 1000,
                    intensity: features.energy,
                    frequency: features.spectralCentroid,
                  },
                  emotionalData: newEmotionalData,
                }
              })
            }
          }
        }

        audioRefs.processorNode.current = scriptProcessor
      } catch (error) {
        setAnalysisState((prev) => ({
          ...prev,
          error: 'Failed to initialize audio system',
        }))
      }
    }

    initAudio()
    return () => {
      if (audioRefs.context.current) {
        audioRefs.context.current.close()
      }
    }
  }, [])

  // Start recording with enhanced processing
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      const source = audioRefs.context.current.createMediaStreamSource(stream)

      // Connect the audio nodes
      source.connect(audioRefs.analyser.current)
      audioRefs.analyser.current.connect(audioRefs.processorNode.current)
      audioRefs.processorNode.current.connect(
        audioRefs.context.current.destination
      )

      const mediaRecorder = new MediaRecorder(stream)
      audioRefs.mediaRecorder.current = mediaRecorder
      audioRefs.audioChunks.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioRefs.audioChunks.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioRefs.audioChunks.current, {
          type: 'audio/wav',
        })
        const url = URL.createObjectURL(audioBlob)

        setAudioState((prev) => ({
          ...prev,
          recordings: [
            ...prev.recordings,
            {
              url,
              timestamp: new Date().toLocaleTimeString(),
              duration: prev.recordingTime,
              emotion: analysisState.currentEmotion,
              confidence: analysisState.confidence,
            },
          ],
        }))

        await analyzeRecording(audioBlob)
      }

      mediaRecorder.start(100)
      setAudioState((prev) => ({ ...prev, isRecording: true }))
    } catch (error) {
      setAnalysisState((prev) => ({
        ...prev,
        error: 'Failed to start recording',
      }))
    }
  }

  // Recording timer
  useEffect(() => {
    let interval
    if (audioState.isRecording) {
      interval = setInterval(() => {
        setAudioState((prev) => ({
          ...prev,
          recordingTime: prev.recordingTime + 1,
        }))
      }, 1000)
    } else {
      setAudioState((prev) => ({ ...prev, recordingTime: 0 }))
    }
    return () => clearInterval(interval)
  }, [audioState.isRecording])

  const detectEmotion = (features) => {
    // Simplified emotion detection logic
    const { energy, zeroCrossings, spectralCentroid } = features

    let emotion = 'NEUTRAL'
    let confidence = 0.5

    if (energy > 0.7 && zeroCrossings > 1000) {
      emotion = 'HAPPY'
      confidence = 0.8
    } else if (energy < 0.3 && zeroCrossings < 500) {
      emotion = 'SAD'
      confidence = 0.7
    } else if (energy > 0.8 && zeroCrossings > 1500) {
      emotion = 'ANGRY'
      confidence = 0.9
    }

    return {
      emotion,
      confidence,
      features: {
        energy,
        pitch: zeroCrossings / 1000,
        intensity: energy,
        frequency: spectralCentroid,
      },
    }
  }

  const analyzeRecording = async (blob) => {
    setAnalysisState((prev) => ({ ...prev, isAnalyzing: true }))

    try {
      const arrayBuffer = await blob.arrayBuffer()
      const audioBuffer = await audioRefs.context.current.decodeAudioData(
        arrayBuffer
      )

      const channelData = audioBuffer.getChannelData(0)
      const features = {
        energy: Math.sqrt(
          channelData.reduce((acc, val) => acc + val * val, 0) /
            channelData.length
        ),
        zeroCrossings: channelData
          .slice(1)
          .reduce(
            (acc, val, i) =>
              acc + Math.abs(Math.sign(val) - Math.sign(channelData[i])),
            0
          ),
        spectralCentroid: 0, // Would need FFT implementation for actual spectral centroid
      }

      const emotionResult = detectEmotion(features)

      setAnalysisState((prev) => ({
        ...prev,
        currentEmotion: emotionResult.emotion,
        confidence: emotionResult.confidence,
        features: emotionResult.features,
        isAnalyzing: false,
      }))
    } catch (error) {
      setAnalysisState((prev) => ({
        ...prev,
        isAnalyzing: false,
        error: 'Failed to analyze recording',
      }))
    }
  }

  return (
    <>
      <Navbar />
      <div className='mt-10 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen p-6'>
        <div className='max-w-7xl mx-auto space-y-8'>
          {/* Header */}
          <header className='text-center space-y-4'>
            <div className='inline-block p-4 bg-white rounded-full shadow-lg'>
              <Brain className='w-16 h-16 text-green-600' />
            </div>
            <h1 className='text-4xl font-bold text-green-900'>
              Voice Emotion Analysis
            </h1>
            <p className='text-lg text-green-700 max-w-2xl mx-auto'>
              Real-time emotion detection through voice analysis
            </p>
          </header>

          {analysisState.error && (
            <CustomAlert
              title='Error'
              description={analysisState.error}
              variant='error'
            />
          )}

          <div className='grid md:grid-cols-2 gap-8'>
            {/* Recording Section */}
            <section className='bg-white rounded-xl shadow-xl p-6 space-y-6'>
              <h2 className='text-2xl font-semibold text-green-900 flex items-center gap-2'>
                <Mic className='w-6 h-6' />
                Voice Recording
              </h2>

              {/* Recording Controls */}
              <div className='flex justify-center'>
                {audioState.isRecording ? (
                  <button
                    onClick={() => {
                      audioRefs.mediaRecorder.current?.stop()
                      setAudioState((prev) => ({ ...prev, isRecording: false }))
                    }}
                    className='bg-red-500 text-white px-8 py-4 rounded-full hover:bg-red-600 transition-colors flex items-center gap-2'
                  >
                    <StopCircle className='w-6 h-6' />
                    Stop Recording ({audioState.recordingTime}s)
                  </button>
                ) : (
                  <button
                    onClick={startRecording}
                    className='bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 transition-colors flex items-center gap-2'
                  >
                    <Mic className='w-6 h-6' />
                    Start Recording
                  </button>
                )}
              </div>

              {/* Recordings List */}
              <div className='space-y-4'>
                <h3 className='font-medium text-green-900'>
                  Recent Recordings
                </h3>
                {audioState.recordings.map((recording, index) => (
                  <div
                    key={index}
                    className='p-4 bg-green-50 rounded-lg space-y-3'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        {EMOTIONS[recording.emotion]?.icon}
                        <span className='font-medium text-green-900'>
                          Recording {index + 1}
                        </span>
                      </div>
                      <span className='text-sm text-green-600'>
                        {recording.timestamp}
                      </span>
                    </div>

                    <audio src={recording.url} controls className='w-full' />

                    <div className='flex items-center justify-between text-sm'>
                      <div className='text-green-700'>
                        Duration: {recording.duration}s
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-green-700'>
                          Confidence: {Math.round(recording.confidence * 100)}%
                        </span>
                        {recording.confidence > 0.7 ? (
                          <ThumbsUp className='w-4 h-4 text-green-500' />
                        ) : (
                          <AlertCircle className='w-4 h-4 text-yellow-500' />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Analysis Section */}
            <section className='space-y-8'>
              {/* Real-time Analysis Card */}
              <div className='bg-white rounded-xl shadow-xl p-6'>
                <h2 className='text-2xl font-semibold text-green-900 flex items-center gap-2 mb-6'>
                  <Activity className='w-6 h-6' />
                  Real-time Analysis
                </h2>

                {/* Voice Pattern Visualization */}
                <div className='h-64 mb-6'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <LineChart data={analysisState.emotionalData}>
                      <CartesianGrid strokeDasharray='3 3' stroke='#E9D5FF' />
                      <XAxis
                        dataKey='time'
                        stroke='#6B21A8'
                        tick={{ fontSize: 12 }}
                        interval='preserveStartEnd'
                      />
                      <YAxis
                        stroke='#6B21A8'
                        domain={[0, 100]}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FAF5FF',
                          border: '1px solid #7C3AED',
                          borderRadius: '0.5rem',
                        }}
                        formatter={(value) => [
                          `${Math.round(value)}%`,
                          'Intensity',
                        ]}
                      />
                      <Line
                        type='monotone'
                        dataKey='intensity'
                        stroke='#7C3AED'
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Current Emotion Display */}
                {analysisState.currentEmotion && (
                  <div className='p-4 bg-green-50 rounded-lg'>
                    <div className='flex items-center justify-between mb-4'>
                      <div className='flex items-center gap-2'>
                        {EMOTIONS[analysisState.currentEmotion]?.icon}
                        <span className='font-medium text-green-900'>
                          {EMOTIONS[analysisState.currentEmotion]?.name}
                        </span>
                      </div>
                      <div className='text-sm text-green-600'>
                        Confidence: {Math.round(analysisState.confidence * 100)}
                        %
                      </div>
                    </div>

                    {/* Feature Breakdown */}
                    <div className='space-y-2'>
                      {Object.entries(analysisState.features).map(
                        ([feature, value]) => (
                          <div
                            key={feature}
                            className='flex items-center justify-between'
                          >
                            <span className='text-sm text-green-700 capitalize'>
                              {feature}
                            </span>
                            <div className='w-48 h-2 bg-green-100 rounded-full overflow-hidden'>
                              <div
                                className='h-full bg-green-600 transition-all duration-300'
                                style={{ width: `${value * 100}%` }}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {analysisState.isAnalyzing && (
                  <div className='flex items-center justify-center text-green-600 mt-4'>
                    <RefreshCw className='w-5 h-5 mr-2 animate-spin' />
                    Processing voice patterns...
                  </div>
                )}
              </div>

              {/* Emotion Reference Card */}
              <div className='bg-white rounded-xl shadow-xl p-6'>
                <h2 className='text-2xl font-semibold text-green-900 flex items-center gap-2 mb-6'>
                  <Brain className='w-6 h-6' />
                  Emotion Patterns
                </h2>

                <div className='grid grid-cols-2 gap-4'>
                  {Object.entries(EMOTIONS).map(([key, emotion]) => (
                    <div
                      key={key}
                      className='p-4 rounded-lg bg-green-50 border border-green-100'
                    >
                      <div className={`${emotion.color} mb-2`}>
                        {emotion.icon}
                      </div>
                      <h3 className='font-medium text-green-900'>
                        {emotion.name}
                      </h3>
                      <div className='space-y-1 mt-2'>
                        {Object.entries(emotion.features).map(
                          ([feature, value]) => (
                            <p key={feature} className='text-sm text-green-600'>
                              {feature}: {value}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default EmotionContextPage

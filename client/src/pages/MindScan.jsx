import * as faceapi from 'face-api.js'
import jsPDF from 'jspdf' // correct
import 'jspdf-autotable'
import {
  AlertTriangle,
  Camera,
  Download,
  Heart,
  History,
  PieChart as PieChartIcon,
  RefreshCw,
  Save,
  Settings,
  Share,
} from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Navbar from '../components/Navbar'
import Sentiment from '../components/Sentiment'
import { downloadResults } from '../styles/mindscan-report' // Adjust the path as needed

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82ca9d',
  '#8dd1e1',
  '#a4de6c',
  '#d0ed57',
]

const MindScan = () => {
  const [emotions, setEmotions] = useState([])
  const [emotionHistory, setEmotionHistory] = useState([])
  const [conclusion, setConclusion] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [settings, setSettings] = useState({
    detectionFrequency: 5,
    saveHistory: true,
    showConfidence: true,
    autoDetect: false,
    detectionInterval: 1000, // 1 second
  })
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [calibrating, setCalibrating] = useState(false)
  const [error, setError] = useState(null)
  const [detectionQuality, setDetectionQuality] = useState('good')
  const [isAutoDetecting, setIsAutoDetecting] = useState(false)
  const [emotionTrend, setEmotionTrend] = useState([])
  const [lastDetectedEmotion, setLastDetectedEmotion] = useState(null)
  const [faceDetected, setFaceDetected] = useState(false)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const detectionIntervalRef = useRef(null)

  useEffect(() => {
    startCamera()
    loadModels()
    return () => {
      stopVideo()
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
    }
  }, [])

  const loadModels = async () => {
    const MODEL_URL = '/models'
    try {
      setCalibrating(true)
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ])
      setCalibrating(false)
    } catch (err) {
      setError('Failed to load detection models. Please refresh and try again.')
      setCalibrating(false)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play()
            resolve()
          }
        })
        // Start face detection overlay
        startFaceDetectionOverlay()
      }
    } catch (err) {
      setError('Camera access denied. Please check your permissions.')
    }
  }

  const startFaceDetectionOverlay = () => {
    const canvas = canvasRef.current
    const video = videoRef.current

    // Set initial dimensions
    const displaySize = {
      width: video.videoWidth || video.clientWidth,
      height: video.videoHeight || video.clientHeight,
    }

    // Only proceed if we have valid dimensions
    if (displaySize.width === 0 || displaySize.height === 0) {
      console.warn('Invalid video dimensions, waiting for video to load...')
      return
    }

    canvas.width = displaySize.width
    canvas.height = displaySize.height
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async () => {
      if (!video.videoWidth || !video.videoHeight) return // Skip if video not ready

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions()

      setFaceDetected(detections.length > 0)

      // Update display size in case video dimensions changed
      const currentDisplaySize = {
        width: video.videoWidth || video.clientWidth,
        height: video.videoHeight || video.clientHeight,
      }

      const resizedDetections = faceapi.resizeResults(
        detections,
        currentDisplaySize
      )
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      faceapi.draw.drawDetections(canvas, resizedDetections)
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)
  }

  // Fix for the export button click handler
  const handleExportClick = () => {
    if (!emotions || emotions.length === 0) {
      setError('No emotion data available to export')
      return
    }

    try {
      // Ensure all required data is present
      const validEmotions = emotions.map((emotion) => {
        if (!emotion.emotion || !emotion.confidence || !emotion.timestamp) {
          throw new Error('Invalid emotion data format')
        }
        return {
          emotion: emotion.emotion,
          confidence: emotion.confidence,
          timestamp: emotion.timestamp,
        }
      })

      downloadResults(validEmotions)
    } catch (err) {
      setError('Failed to generate PDF report: ' + err.message)
    }
  }

  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
  }

  const toggleAutoDetection = () => {
    if (isAutoDetecting) {
      clearInterval(detectionIntervalRef.current)
      setIsAutoDetecting(false)
    } else {
      setIsAutoDetecting(true)
      detectionIntervalRef.current = setInterval(
        detectEmotion,
        settings.detectionInterval
      )
    }
  }

  const detectEmotion = async () => {
    if (!videoRef.current || emotions.length >= settings.detectionFrequency)
      return

    try {
      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions()

      if (detection) {
        const emotionsArray = Object.entries(detection.expressions)
        const [dominantEmotion, confidence] = emotionsArray.reduce((a, b) =>
          a[1] > b[1] ? a : b
        )

        const timestamp = new Date().toISOString()
        const emotionData = {
          emotion: dominantEmotion,
          confidence: Math.round(confidence * 100),
          timestamp,
          allEmotions: emotionsArray.map(([emotion, value]) => ({
            emotion,
            value: Math.round(value * 100),
          })),
        }

        setEmotions((prev) => [...prev, emotionData])
        setLastDetectedEmotion(emotionData)

        if (settings.saveHistory) {
          const newHistory = [...emotionHistory, emotionData]
          setEmotionHistory(newHistory)
          updateEmotionTrend(newHistory)
        }

        setDetectionQuality(emotionData.confidence > 70 ? 'good' : 'poor')

        // Stop auto-detection if we've reached the limit
        if (
          emotions.length + 1 >= settings.detectionFrequency &&
          isAutoDetecting
        ) {
          toggleAutoDetection()
        }
      } else {
        setError('No face detected. Please ensure your face is visible.')
      }
    } catch (err) {
      setError('Error during emotion detection. Please try again.')
    }
  }

  const updateEmotionTrend = (history) => {
    const trendData = history.map((entry, index) => ({
      timestamp: new Date(entry.timestamp).toLocaleTimeString(),
      confidence: entry.confidence,
      emotion: entry.emotion,
    }))
    setEmotionTrend(trendData)
  }

  const generateResults = () => {
    const emotionCounts = emotions.reduce((acc, { emotion, confidence }) => {
      acc[emotion] = (acc[emotion] || 0) + 1
      return acc
    }, {})

    const dominantEmotion = Object.entries(emotionCounts).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0]

    const averageConfidence =
      emotions.reduce((sum, { confidence }) => sum + confidence, 0) /
      emotions.length

    // Calculate emotional stability
    const emotionChanges = emotions
      .slice(1)
      .filter((e, i) => e.emotion !== emotions[i].emotion).length
    const stabilityScore = Math.round(
      ((emotions.length - 1 - emotionChanges) / (emotions.length - 1)) * 100
    )

    setConclusion(
      `Dominant emotion: ${dominantEmotion} (detected ${emotionCounts[dominantEmotion]} times)\n` +
        `Average confidence: ${averageConfidence.toFixed(1)}%\n` +
        `Emotional stability: ${stabilityScore}%\n` +
        `Detection quality: ${detectionQuality}`
    )
    setShowResults(true)
  }

  const resetDetection = () => {
    setEmotions([])
    setConclusion('')
    setShowResults(false)
    setLastDetectedEmotion(null)
    if (isAutoDetecting) {
      toggleAutoDetection()
    }
  }

  const chartData = useMemo(() => {
    const counts = emotions.reduce((acc, { emotion }) => {
      acc[emotion] = (acc[emotion] || 0) + 1
      return acc
    }, {})
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [emotions])

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill='white'
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline='central'
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <>
      <Navbar />
      <div className='mt-12 bg-gradient-to-br from-green-100 to-green-200 min-h-screen px-4 py-8'>
        <div className='max-w-6xl mx-auto'>
          {error && (
            <div className='mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center'>
              <AlertTriangle className='h-5 w-5 mr-2' />
              <div>
                <p className='font-bold'>Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className='text-center mb-8'>
            <Heart className='inline-block h-16 w-16 text-green-600 mb-4' />
            <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold text-green-800 mb-4'>
              MindScan
            </h1>
            <p className='text-xl text-green-700'>
              Advanced Emotion Detection & Analysis
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-8'>
            <div className='bg-white rounded-lg shadow-lg p-4'>
              <div className='relative'>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className='w-full rounded-lg'
                />
                <canvas
                  ref={canvasRef}
                  className='absolute top-0 left-0 w-full h-full'
                />
                {lastDetectedEmotion && (
                  <div className='absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded'>
                    {lastDetectedEmotion.emotion} (
                    {lastDetectedEmotion.confidence}%)
                  </div>
                )}
                {!faceDetected && (
                  <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded'>
                    No face detected
                  </div>
                )}
              </div>

              <div className='flex flex-wrap gap-4 mt-4 justify-center'>
                <button
                  onClick={detectEmotion}
                  disabled={
                    emotions.length >= settings.detectionFrequency ||
                    showResults ||
                    !faceDetected
                  }
                  className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 disabled:opacity-50'
                >
                  <Camera className='h-5 w-5' />
                  Detect ({emotions.length}/{settings.detectionFrequency})
                </button>

                {emotions.length === settings.detectionFrequency &&
                  !showResults && (
                    <button
                      onClick={generateResults}
                      className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2'
                    >
                      <PieChartIcon className='h-5 w-5' />
                      Analyze
                    </button>
                  )}

                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className='bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2'
                >
                  <Settings className='h-5 w-5' />
                  Settings
                </button>

                {showResults && (
                  <button
                    onClick={resetDetection}
                    className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2'
                  >
                    <RefreshCw className='h-5 w-5' />
                    Reset
                  </button>
                )}
              </div>

              {lastDetectedEmotion && settings.showConfidence && (
                <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
                  <h4 className='font-semibold mb-2'>All Emotions:</h4>
                  <div className='grid grid-cols-2 gap-2'>
                    {lastDetectedEmotion.allEmotions.map(
                      ({ emotion, value }) => (
                        <div key={emotion} className='flex justify-between'>
                          <span className='capitalize'>{emotion}:</span>
                          <div className='w-24 bg-gray-200 rounded-full h-4'>
                            <div
                              className='bg-green-600 rounded-full h-4'
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className='bg-white rounded-lg shadow-lg p-4'>
              {showResults ? (
                <div className='space-y-6'>
                  <ResponsiveContainer width='100%' height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill='#8884d8'
                        dataKey='value'
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>

                  {emotionTrend.length > 0 && (
                    <div className='mt-6'>
                      <h3 className='text-xl font-bold text-green-800 mb-4'>
                        Emotion Trend
                      </h3>
                      <ResponsiveContainer width='100%' height={200}>
                        <LineChart data={emotionTrend}>
                          <CartesianGrid strokeDasharray='3 3' />
                          <XAxis dataKey='timestamp' />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type='monotone'
                            dataKey='confidence'
                            stroke='#82ca9d'
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  <div className='bg-green-50 p-4 rounded-lg'>
                    <h3 className='text-xl font-bold text-green-800 mb-2'>
                      Analysis
                    </h3>
                    <p className='text-green-700 whitespace-pre-line'>
                      {conclusion}
                    </p>
                  </div>

                  <div className='flex flex-wrap gap-4 justify-center'>
                    <button
                      onClick={handleExportClick}
                      className='bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2'
                    >
                      <Download className='h-5 w-5' />
                      Export PDF Report
                    </button>
                  </div>
                </div>
              ) : (
                <div className='h-full flex items-center justify-center'>
                  <p className='text-gray-500 text-center'>
                    {calibrating
                      ? 'Calibrating...'
                      : 'Detection results will appear here'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {isSettingsOpen && (
            <div className='mt-8 bg-white rounded-lg shadow-lg p-4'>
              <h3 className='text-xl font-bold text-green-800 mb-4'>
                Settings
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Detection Frequency
                  </label>
                  <input
                    type='range'
                    min='3'
                    max='10'
                    value={settings.detectionFrequency}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        detectionFrequency: parseInt(e.target.value),
                      }))
                    }
                    className='w-full'
                  />
                  <span className='text-sm text-gray-500'>
                    {settings.detectionFrequency} detections
                  </span>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Auto Detection Interval (ms)
                  </label>
                  <input
                    type='range'
                    min='500'
                    max='3000'
                    step='500'
                    value={settings.detectionInterval}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        detectionInterval: parseInt(e.target.value),
                      }))
                    }
                    className='w-full'
                  />
                  <span className='text-sm text-gray-500'>
                    {settings.detectionInterval}ms
                  </span>
                </div>

                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    id='saveHistory'
                    checked={settings.saveHistory}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        saveHistory: e.target.checked,
                      }))
                    }
                    className='rounded text-green-600'
                  />
                  <label
                    htmlFor='saveHistory'
                    className='text-sm text-gray-700'
                  >
                    Save detection history
                  </label>
                </div>

                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    id='showConfidence'
                    checked={settings.showConfidence}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        showConfidence: e.target.checked,
                      }))
                    }
                    className='rounded text-green-600'
                  />
                  <label
                    htmlFor='showConfidence'
                    className='text-sm text-gray-700'
                  >
                    Show confidence scores
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Sentiment />
    </>
  )
}

export default MindScan

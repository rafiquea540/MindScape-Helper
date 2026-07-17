import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  BarChart2,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  Info,
  LineChart,
  MessageCircle,
  Moon,
  Settings,
  Sun,
  TrendingUp,
} from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const analyzeText = (text) => {
  const emotionLexicon = {
    anxiety: ['worried', 'anxious', 'nervous', 'stressed', 'panic', 'fear'],
    depression: ['sad', 'hopeless', 'depressed', 'miserable', 'lonely'],
    anger: ['angry', 'frustrated', 'mad', 'irritated', 'furious'],
    joy: ['happy', 'excited', 'pleased', 'delighted', 'content'],
    gratitude: ['thankful', 'grateful', 'blessed', 'appreciative'],
    hope: ['hopeful', 'optimistic', 'looking forward', 'positive'],
  }

  const cognitivePatterns = {
    catastrophizing: ['terrible', 'horrible', 'disaster', 'worst', 'never'],
    blackAndWhite: ['always', 'never', 'everyone', 'no one', 'impossible'],
    overgeneralization: ['everything', 'nothing', 'every time', 'all'],
    shouldStatements: ['should', 'must', 'have to', 'ought to'],
    personalization: ['my fault', 'blame me', 'because of me'],
  }

  const words = text.toLowerCase().split(/\s+/)
  const emotions = {}
  const patterns = {}
  let moodScore = 0

  // Analyze emotions
  Object.entries(emotionLexicon).forEach(([emotion, keywords]) => {
    emotions[emotion] = keywords.filter((keyword) =>
      text.toLowerCase().includes(keyword)
    ).length

    // Adjust mood score based on emotion type
    if (['joy', 'gratitude', 'hope'].includes(emotion)) {
      moodScore += emotions[emotion] * 2
    } else {
      moodScore -= emotions[emotion]
    }
  })

  // Detect cognitive patterns
  Object.entries(cognitivePatterns).forEach(([pattern, keywords]) => {
    patterns[pattern] = keywords.filter((keyword) =>
      text.toLowerCase().includes(keyword)
    ).length
    moodScore -= patterns[pattern] // Negative impact on mood score
  })

  // Calculate stress indicators
  const stressWords = ['stress', 'overwhelm', 'pressure', 'burnout']
  const stressScore = stressWords.filter((word) =>
    text.toLowerCase().includes(word)
  ).length

  // Sentiment normalization
  const normalizedScore = Math.max(-10, Math.min(10, moodScore))

  return {
    emotions,
    patterns,
    stressLevel: stressScore,
    moodScore: normalizedScore,
    timestamp: new Date(),
    wordCount: words.length,
  }
}

// Custom hook for persistence
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

const MentalWellnessAnalyzer = () => {
  const [entries, setEntries] = useLocalStorage('wellness-entries', [])
  const [currentEntry, setCurrentEntry] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [showTrends, setShowTrends] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const getTrendData = useCallback(() => {
    return entries.map((entry) => ({
      date: new Date(entry.analysis.timestamp).toLocaleDateString(),
      mood: entry.analysis.moodScore,
      stress: entry.analysis.stressLevel,
    }))
  }, [entries])

  const getAverageMood = useCallback(() => {
    if (entries.length === 0) return 0
    return (
      entries.reduce((acc, entry) => acc + entry.analysis.moodScore, 0) /
      entries.length
    )
  }, [entries])

  const getInsights = useCallback(() => {
    if (entries.length < 2) return []

    const insights = []
    const recentEntries = entries.slice(-5)
    const avgMood = getAverageMood()
    const latestEntry = entries[entries.length - 1]

    // Trend detection
    const moodTrend = recentEntries.reduce((acc, entry, i, arr) => {
      if (i === 0) return acc
      return acc + (entry.analysis.moodScore - arr[i - 1].analysis.moodScore)
    }, 0)

    // Pattern detection
    const hasStressPattern = recentEntries.every(
      (entry) => entry.analysis.stressLevel > 0
    )
    const hasPositiveProgress = moodTrend > 2
    const hasNegativePattern = moodTrend < -2

    if (hasStressPattern) {
      insights.push({
        type: 'warning',
        icon: <AlertTriangle className='text-amber-500' />,
        message:
          'Consistent stress patterns detected. Consider stress management techniques.',
      })
    }

    if (hasPositiveProgress) {
      insights.push({
        type: 'success',
        icon: <CheckCircle2 className='text-green-500' />,
        message: 'Your mood shows positive improvement! Keep up the good work!',
      })
    }

    if (hasNegativePattern) {
      insights.push({
        type: 'info',
        icon: <Info className='text-blue-500' />,
        message:
          'Recent entries show increased challenges. Would you like to explore coping strategies?',
      })
    }

    return insights
  }, [entries, getAverageMood])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!currentEntry.trim() || isAnalyzing) return

    setIsAnalyzing(true)
    try {
      const newAnalysis = analyzeText(currentEntry)
      const newEntry = {
        text: currentEntry,
        analysis: newAnalysis,
      }

      setEntries((prev) => [...prev, newEntry])
      setAnalysis(newAnalysis)
      setCurrentEntry('')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='container mx-auto px-4 py-6'
      >
        {/* Header */}
        <div className='bg-white rounded-xl shadow-lg p-6 mb-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <Brain className='w-10 h-10 text-green-600' />
              <h1 className='text-3xl font-bold ml-3 text-gray-800'>
                Mental Wellness Analyzer
              </h1>
            </div>
            <div className='flex gap-4'>
              <button
                onClick={() => setShowTrends(!showTrends)}
                className='flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'
              >
                {showTrends ? (
                  <MessageCircle className='w-5 h-5 mr-2' />
                ) : (
                  <BarChart2 className='w-5 h-5 mr-2' />
                )}
                {showTrends ? 'Show Journal' : 'Show Trends'}
              </button>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-4 gap-6'>
          {/* Main Content - Takes up 3 columns on xl screens */}
          <div className='xl:col-span-3 space-y-6'>
            {!showTrends ? (
              <>
                {/* Entry Form */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='bg-white rounded-xl shadow-lg p-6 w-full'
                >
                  <form onSubmit={handleSubmit} className='w-full'>
                    <textarea
                      value={currentEntry}
                      onChange={(e) => setCurrentEntry(e.target.value)}
                      placeholder='How are you feeling? Share your thoughts...'
                      className='w-full p-4 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[150px] transition-all duration-300'
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className='mt-4 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors'
                      type='submit'
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                    </motion.button>
                  </form>
                </motion.div>

                {/* Analysis Results */}
                <AnimatePresence>
                  {analysis && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className='bg-white rounded-xl shadow-lg p-6 w-full'
                    >
                      <h2 className='text-xl font-semibold mb-4 text-gray-800'>
                        Analysis Results
                      </h2>

                      {/* Mood Score */}
                      <div className='mb-6'>
                        <div className='flex items-center justify-between mb-2'>
                          <span className='font-medium text-gray-700'>
                            Mood Score
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              analysis.moodScore > 0
                                ? 'bg-green-100 text-green-700'
                                : analysis.moodScore < 0
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {analysis.moodScore}
                          </span>
                        </div>
                        <div className='h-2 bg-gray-200 rounded'>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(analysis.moodScore + 10) * 5}%`,
                            }}
                            className={`h-full rounded ${
                              analysis.moodScore > 0
                                ? 'bg-green-500'
                                : analysis.moodScore < 0
                                ? 'bg-red-500'
                                : 'bg-yellow-500'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Emotions Grid */}
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                        {/* Emotions */}
                        <div>
                          <h3 className='font-medium text-gray-700 mb-2'>
                            Detected Emotions
                          </h3>
                          <div className='flex flex-wrap gap-2'>
                            {Object.entries(analysis.emotions).map(
                              ([emotion, count]) =>
                                count > 0 && (
                                  <span
                                    key={emotion}
                                    className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm'
                                  >
                                    {emotion} ({count})
                                  </span>
                                )
                            )}
                          </div>
                        </div>

                        {/* Patterns */}
                        <div>
                          <h3 className='font-medium text-gray-700 mb-2'>
                            Thought Patterns
                          </h3>
                          <div className='flex flex-wrap gap-2'>
                            {Object.entries(analysis.patterns).map(
                              ([pattern, count]) =>
                                count > 0 && (
                                  <span
                                    key={pattern}
                                    className='px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm'
                                  >
                                    {pattern
                                      .replace(/([A-Z])/g, ' $1')
                                      .toLowerCase()}
                                  </span>
                                )
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stress Level */}
                      <div>
                        <h3 className='font-medium text-gray-700 mb-2'>
                          Stress Indicators
                        </h3>
                        <div className='flex items-center'>
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{
                                scale: i < analysis.stressLevel ? 1 : 0.5,
                              }}
                              className={`w-4 h-4 rounded-full mr-1 ${
                                i < analysis.stressLevel
                                  ? 'bg-red-500'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              // Trends View
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='bg-white rounded-xl shadow-lg p-6 w-full'
              >
                <h2 className='text-xl font-semibold mb-6 text-gray-800'>
                  Mood Trends
                </h2>
                <div className='h-[400px]'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <RechartsLineChart data={getTrendData()}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='date' />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type='monotone'
                        dataKey='mood'
                        stroke='#059669'
                        name='Mood'
                      />
                      <Line
                        type='monotone'
                        dataKey='stress'
                        stroke='#DC2626'
                        name='Stress'
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar - Takes up 1 column on xl screens */}
          <div className='xl:col-span-1 space-y-6'>
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='bg-white rounded-xl shadow-lg p-6'
            >
              <h2 className='text-xl font-semibold mb-4 text-gray-800'>
                Overview
              </h2>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <TrendingUp className='w-5 h-5 text-green-600 mr-2' />
                    <span>Average Mood</span>
                  </div>
                  <span className='font-semibold'>
                    {getAverageMood().toFixed(1)}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <Calendar className='w-5 h-5 text-green-600 mr-2' />
                    <span>Total Entries</span>
                  </div>
                  <span className='font-semibold'>{entries.length}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <Clock className='w-5 h-5 text-green-600 mr-2' />
                    <span>Latest Entry</span>
                  </div>
                  <span className='font-semibold'>
                    {entries.length > 0
                      ? new Date(
                          entries[entries.length - 1].analysis.timestamp
                        ).toLocaleDateString()
                      : 'No entries yet'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Insights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='bg-white rounded-xl shadow-lg p-6'
            >
              <h2 className='text-xl font-semibold mb-4 text-gray-800'>
                Insights
              </h2>
              <div className='space-y-4'>
                {getInsights().map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className='flex items-start p-3 rounded-lg bg-gray-50'
                  >
                    {insight.icon}
                    <span className='ml-2 text-sm'>{insight.message}</span>
                  </motion.div>
                ))}
                {getInsights().length === 0 && (
                  <div className='text-center text-gray-500 py-4'>
                    Add more entries to receive personalized insights
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent History */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='bg-white rounded-xl shadow-lg p-6'
            >
              <h2 className='text-xl font-semibold mb-4 text-gray-800'>
                Recent Entries
              </h2>
              <div className='space-y-4'>
                {entries
                  .slice(-3)
                  .reverse()
                  .map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className='p-3 rounded-lg bg-gray-50'
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm text-gray-500'>
                          {new Date(entry.analysis.timestamp).toLocaleString()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            entry.analysis.moodScore > 0
                              ? 'bg-green-100 text-green-700'
                              : entry.analysis.moodScore < 0
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          Score: {entry.analysis.moodScore}
                        </span>
                      </div>
                      <p className='text-sm text-gray-700 line-clamp-2'>
                        {entry.text}
                      </p>
                    </motion.div>
                  ))}
                {entries.length === 0 && (
                  <div className='text-center text-gray-500 py-4'>
                    No entries yet
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default MentalWellnessAnalyzer

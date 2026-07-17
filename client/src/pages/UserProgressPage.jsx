import {
  Activity,
  Award,
  Brain,
  Calendar,
  Heart,
  Sparkles,
  Target,
  ThumbsUp,
  TrendingUp,
} from 'lucide-react'
import React, { useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Navbar from '../components/Navbar'

const mockProgressData = [
  { date: 'Week 1', wellbeingScore: 65, engagement: 40, moodScore: 55 },
  { date: 'Week 2', wellbeingScore: 68, engagement: 45, moodScore: 60 },
  { date: 'Week 3', wellbeingScore: 72, engagement: 55, moodScore: 65 },
  { date: 'Week 4', wellbeingScore: 75, engagement: 60, moodScore: 70 },
  { date: 'Week 5', wellbeingScore: 78, engagement: 65, moodScore: 75 },
  { date: 'Week 6', wellbeingScore: 82, engagement: 70, moodScore: 80 },
]

const achievementsList = [
  { id: 1, title: 'First Session Complete', icon: Award, progress: 100 },
  { id: 2, title: 'Mindfulness Master', icon: Brain, progress: 75 },
  { id: 3, title: 'Consistent Check-ins', icon: Calendar, progress: 60 },
  { id: 4, title: 'Emotional Growth', icon: Heart, progress: 85 },
]

const UserProgressPage = () => {
  const [feedbackRating, setFeedbackRating] = useState(0)

  return (
    <>
      <Navbar />
      <div className='mt-10 min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-8'>
        {/* Header Section */}
        <div className='mb-8 text-center'>
          <div className='inline-flex items-center justify-center gap-3 mb-4'>
            <Sparkles className='w-8 h-8 text-green-600' />
            <h1 className='text-3xl md:text-4xl font-bold text-green-800'>
              Your Wellness Journey
            </h1>
          </div>
          <p className='text-lg text-green-700'>
            Watch your progress bloom as you continue your mental wellness
            journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          <StatsCard
            title='Overall Progress'
            value='82%'
            icon={TrendingUp}
            color='text-green-600'
          />
          <StatsCard
            title='Mindfulness Score'
            value='75/100'
            icon={Brain}
            color='text-green-600'
          />
          <StatsCard
            title='Engagement Level'
            value='High'
            icon={Activity}
            color='text-green-600'
          />
          <StatsCard
            title='Goals Achieved'
            value='8/10'
            icon={Target}
            color='text-green-600'
          />
        </div>

        {/* Progress Chart */}
        <div className='bg-white rounded-2xl shadow-sm p-6 mb-8 border border-green-100'>
          <h2 className='text-xl font-semibold mb-4 text-green-800'>
            Progress Overview
          </h2>
          <div className='h-80 w-full'>
            <ResponsiveContainer>
              <LineChart data={mockProgressData}>
                <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                <XAxis dataKey='date' stroke='#374151' />
                <YAxis stroke='#374151' />
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='wellbeingScore'
                  stroke='#059669'
                  name='Wellbeing'
                  strokeWidth={2}
                />
                <Line
                  type='monotone'
                  dataKey='engagement'
                  stroke='#047857'
                  name='Engagement'
                  strokeWidth={2}
                />
                <Line
                  type='monotone'
                  dataKey='moodScore'
                  stroke='#065f46'
                  name='Mood'
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Achievements Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
          {achievementsList.map((achievement) => (
            <div
              key={achievement.id}
              className='bg-white rounded-2xl shadow-sm p-6 border border-green-100 hover:border-green-200 transition-colors'
            >
              <div className='flex items-center gap-4'>
                <div className='p-3 rounded-xl bg-green-50'>
                  <achievement.icon className='w-6 h-6 text-green-600' />
                </div>
                <div className='flex-1'>
                  <h3 className='font-semibold text-green-800'>
                    {achievement.title}
                  </h3>
                  <div className='w-full bg-green-100 rounded-full h-2.5 mt-2'>
                    <div
                      className='bg-green-600 h-2.5 rounded-full transition-all duration-500 ease-in-out'
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
                <span className='text-sm font-medium text-green-700'>
                  {achievement.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Section */}
        <div className='bg-white rounded-2xl shadow-sm p-6 border border-green-100'>
          <h2 className='text-xl font-semibold mb-4 text-green-800'>
            Share Your Thoughts
          </h2>
          <p className='text-green-700 mb-4'>
            How helpful was your session today?
          </p>
          <div className='flex gap-2 mb-6'>
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setFeedbackRating(rating)}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  feedbackRating === rating
                    ? 'bg-green-600 text-white scale-110'
                    : 'bg-green-50 hover:bg-green-100 text-green-600'
                }`}
              >
                <ThumbsUp className='w-6 h-6' />
              </button>
            ))}
          </div>
          <textarea
            placeholder='Tell us more about your experience...'
            className='w-full p-4 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-green-50 placeholder-green-400'
            rows={4}
          />
          <button className='mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105'>
            Submit Feedback
          </button>
        </div>
      </div>
    </>
  )
}

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color }) => (
  <div className='bg-white rounded-2xl shadow-sm p-6 border border-green-100 hover:border-green-200 transition-colors'>
    <div className='flex items-center justify-between'>
      <div>
        <p className='text-sm text-green-700 mb-1'>{title}</p>
        <p className='text-2xl font-bold text-green-800'>{value}</p>
      </div>
      <div className={`p-3 rounded-xl bg-green-50 ${color}`}>
        <Icon className='w-6 h-6' />
      </div>
    </div>
  </div>
)

export default UserProgressPage

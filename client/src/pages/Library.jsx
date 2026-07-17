import {
  ArrowRight,
  BarChart,
  Book,
  ExternalLink,
  Search,
  Shield,
} from 'lucide-react'
import React, { useState } from 'react'
import {
  Bar,
  Cell,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Navbar from '../components/Navbar'

const MentalHealthEducationModule = () => {
  const [activeTab, setActiveTab] = useState('education')
  const [searchTerm, setSearchTerm] = useState('')

  const tabs = [
    { id: 'education', icon: Book, title: 'Learn' },
    { id: 'resources', icon: Search, title: 'Resources' },
    { id: 'sources', icon: Shield, title: 'Sources' },
    { id: 'statistics', icon: BarChart, title: 'Data' },
  ]

  const mentalHealthData = [
    { condition: 'Depression', prevalence: 264, color: '#059669' },
    { condition: 'Anxiety', prevalence: 284, color: '#10B981' },
    { condition: 'Bipolar', prevalence: 46, color: '#34D399' },
    { condition: 'Eating Disorders', prevalence: 16, color: '#6EE7B7' },
    { condition: 'Schizophrenia', prevalence: 20, color: '#A7F3D0' },
  ]

  const resources = [
    {
      title: 'Understanding Depression',
      type: 'Article',
      link: 'https://www.helpguide.org/articles/depression/depression-symptoms-and-warning-signs.htm',
    },
    {
      title: 'Headspace: Meditation App',
      type: 'App',
      link: 'https://www.headspace.com/',
    },
    {
      title: 'Anxiety Coping Strategies',
      type: 'Video',
      link: 'https://www.youtube.com/watch?v=WWloIAQpMcQ',
    },
    {
      title: '7 Cups: Online Therapy',
      type: 'Community',
      link: 'https://www.7cups.com/',
    },
    {
      title: 'Mind over Mood',
      type: 'eBook',
      link: 'https://mindovermood.com/',
    },
  ]

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'education':
        return (
          <div className='space-y-6'>
            <h3 className='text-2xl font-semibold text-green-800'>
              Mental Health Basics
            </h3>
            <p className='text-green-700 text-lg'>
              Explore key concepts in mental health and well-being. Our curated
              content helps you understand various aspects of mental health.
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {[
                {
                  title: 'Understanding Emotions',
                  link: 'https://www.verywellmind.com/what-are-emotions-2795178',
                },
                {
                  title: 'Stress Management',
                  link: 'https://www.mayoclinic.org/healthy-lifestyle/stress-management/basics/stress-basics/hlv-20049495',
                },
                {
                  title: 'Building Resilience',
                  link: 'https://positivepsychology.com/resilience-skills/',
                },
                {
                  title: 'Healthy Relationships',
                  link: 'https://www.psychalive.org/category/alive-to-intimacy/',
                },
              ].map((topic, index) => (
                <a
                  key={index}
                  href={topic.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'
                >
                  <h4 className='text-lg font-semibold text-green-700 mb-2'>
                    {topic.title}
                  </h4>
                  <span className='text-green-600 hover:text-green-800 font-medium flex items-center'>
                    Learn more <ExternalLink size={16} className='ml-1' />
                  </span>
                </a>
              ))}
            </div>
          </div>
        )
      case 'resources':
        return (
          <div className='space-y-6'>
            <h3 className='text-2xl font-semibold text-green-800'>
              Resource Directory
            </h3>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search resources...'
                className='w-full py-3 px-4 rounded-full border-2 border-green-300 focus:outline-none focus:border-green-500 text-lg'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className='absolute right-4 top-3.5 text-green-500'
                size={24}
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
              {filteredResources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'
                >
                  <h4 className='text-lg font-semibold text-green-700 mb-1'>
                    {resource.title}
                  </h4>
                  <p className='text-green-600 text-sm flex items-center justify-between'>
                    {resource.type}
                    <ExternalLink size={16} className='ml-1' />
                  </p>
                </a>
              ))}
            </div>
          </div>
        )
      case 'sources':
        return (
          <div className='space-y-6'>
            <h3 className='text-2xl font-semibold text-green-800'>
              Trusted Sources
            </h3>
            <p className='text-green-700 text-lg'>
              Our content is carefully curated from reputable mental health
              organizations and experts in the field.
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {[
                {
                  name: 'World Health Organization (WHO)',
                  url: 'https://www.who.int/mental_health',
                },
                {
                  name: 'National Institute of Mental Health (NIMH)',
                  url: 'https://www.nimh.nih.gov',
                },
                {
                  name: 'American Psychological Association (APA)',
                  url: 'https://www.apa.org',
                },
                {
                  name: 'Mental Health America',
                  url: 'https://www.mhanational.org',
                },
              ].map((source, index) => (
                <a
                  key={index}
                  href={source.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-between'
                >
                  <span className='text-lg font-semibold text-green-700'>
                    {source.name}
                  </span>
                  <ExternalLink size={20} className='text-green-600' />
                </a>
              ))}
            </div>
          </div>
        )
      case 'statistics':
        return (
          <div className='space-y-6'>
            <h3 className='text-2xl font-semibold text-green-800'>
              Mental Health Statistics
            </h3>
            <p className='text-green-700 text-lg'>
              Prevalence of mental health conditions per 1,000 people globally.
            </p>
            <div className='h-80 w-full bg-white p-4 rounded-lg shadow-md'>
              <ResponsiveContainer width='100%' height='100%'>
                <RechartsBarChart
                  data={mentalHealthData}
                  layout='vertical'
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type='number' />
                  <YAxis dataKey='condition' type='category' width={150} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f0fdf4',
                      border: 'none',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey='prevalence'>
                    {mentalHealthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
            <p className='text-sm text-green-600 italic'>
              Data source: World Health Organization (WHO), 2019
            </p>
            <a
              href='https://www.who.int/news-room/fact-sheets/detail/mental-disorders'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center text-green-700 hover:text-green-900'
            >
              Learn more about these statistics{' '}
              <ExternalLink size={16} className='ml-1' />
            </a>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <Navbar />
      <div className='bg-gradient-to-br from-green-50 to-green-100 min-h-screen p-4 md:p-8'>
        <div className='max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden'>
          <div className='p-6 md:p-8'>
            <h2 className='text-3xl md:text-4xl font-bold text-green-800 mb-8'>
              Mental Health Education Hub
            </h2>
            <div className='flex flex-wrap mb-8'>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center flex-1 py-3 px-4 rounded-full m-1 ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  } transition duration-300 ease-in-out text-sm md:text-base`}
                >
                  <tab.icon size={20} className='mr-2' />
                  {tab.title}
                </button>
              ))}
            </div>
            <div className='bg-green-50 p-6 rounded-xl'>{renderContent()}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MentalHealthEducationModule

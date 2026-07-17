import { motion } from 'framer-motion'
import {
  ActivitySquare,
  BarChart2,
  Brain,
  Library,
  Lightbulb,
  MessageSquare,
  Siren,
  Stethoscope,
  UserCircle,
} from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const ModuleCard = ({ title, icon: Icon, description, link, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <Link to={link} className='block h-full'>
      <motion.div
        className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center h-full border border-green-100'
        whileHover={{ scale: 1.05, y: -10 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className='bg-green-100 p-4 rounded-full mb-6'
          whileHover={{ backgroundColor: '#bef264' }}
        >
          <Icon className='w-12 h-12 text-green-600' />
        </motion.div>
        <h3 className='text-xl font-bold text-green-800 mb-3'>{title}</h3>
        <p className='text-green-700 text-center mb-4'>{description}</p>
        <motion.span
          className='text-green-500 font-semibold'
          whileHover={{ scale: 1.1, color: '#16a34a' }}
        >
          Learn More &rarr;
        </motion.span>
      </motion.div>
    </Link>
  </motion.div>
)

const PatientHome = () => {
  const modules = [
    {
      title: 'DocConnect',
      icon: Stethoscope,
      description: 'Schedule consultations with mental health professionals',
      link: '/doctors',
    },
    {
      title: 'Mind Scan',
      icon: Brain,
      description:
        'Advanced emotion recognition and comprehensive diagnostic assessment',
      link: '/mind-scan',
    },
    {
      title: 'Dialogue Dynamo',
      icon: MessageSquare,
      description: 'Engage in meaningful, AI-powered therapeutic conversations',
      link: '/dynamo',
    },
    {
      title: 'Emergency Arsenal',
      icon: Siren,
      description: 'Access immediate support and crisis intervention tools',
      link: '/emergency',
    },
    {
      title: 'Suicide Risk Analysis',
      icon: ActivitySquare,
      description: 'Confidential assessment and prevention strategies',
      link: '/risk-analysis',
    },
    {
      title: 'Ambient Oasis',
      icon: Lightbulb,
      description: 'Immerse yourself in calming and therapeutic activities',
      link: '/oasis',
    },
    {
      title: 'Mindscape Library',
      icon: Library,
      description:
        'Explore a vast collection of mental health resources and education materials',
      link: '/library',
    },

    {
      title: 'User Customization',
      icon: UserCircle,
      description:
        'Tailor your experience to your unique needs and preferences',
      link: '/profile',
    },
    {
      title: 'User Progress',
      icon: BarChart2,
      description: 'Visualize your journey and provide valuable feedback',
      link: '/progress',
    },
    {
      title: 'Emotion',
      icon: BarChart2,
      description: 'Visualize your journey and provide valuable feedback',
      link: '/emotion',
    },
    {
      title: 'Psychometric',
      icon: BarChart2,
      description: 'Visualize your journey and provide valuable feedback',
      link: '/psychometric',
    },
  ]

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-16 px-4 sm:px-6 lg:px-8'
      >
        <div className='max-w-7xl mx-auto'>
          <motion.h1
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className='text-5xl font-extrabold text-green-800 text-center mb-4'
          >
            Your Wellness Journey
          </motion.h1>
          <motion.p
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className='text-xl text-green-600 text-center mb-12'
          >
            Explore our modules to nurture your mental health
          </motion.p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {modules.map((module, index) => (
              <ModuleCard key={index} {...module} index={index} />
            ))}
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default PatientHome

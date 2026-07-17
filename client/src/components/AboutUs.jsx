import { motion } from 'framer-motion'
import {
  Brain,
  MessageSquareHeart,
  Shield,
  Sparkles,
} from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5, scale: 1.02 }}
    className='bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300'
  >
    <div className='flex items-center justify-center w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl mb-6'>
      <Icon className='text-red-600 dark:text-red-400' size={32} />
    </div>
    <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-3'>{title}</h3>
    <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>{description}</p>
  </motion.div>
)

const AboutUs = () => {
  return (
    <section className='bg-white dark:bg-gray-950 py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300'>
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-20'
        >
          <div className='flex justify-center mb-6'>
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className='p-4 bg-red-500/10 dark:bg-red-500/20 rounded-full'
            >
              <Brain className='w-12 h-12 text-red-600 dark:text-red-500' />
            </motion.div>
          </div>
          <h2 className='text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6'>
            Compassionate Tech for <span className='text-red-600 dark:text-red-500'>Your Mind</span>
          </h2>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
            Mindscape Helper combines advanced AI with deep human empathy to provide the support you deserve, exactly when you need it.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10 mb-20'>
          <FeatureCard
            icon={Shield}
            title='Privacy First AI'
            description='Your mental health data is sacred. We use state-of-the-art encryption and anonymization to ensure your privacy is never compromised.'
            delay={0.1}
          />
          <FeatureCard
            icon={Sparkles}
            title='Neural Insights'
            description='Our AI models learn your patterns to offer proactive support, identifying stress triggers before they become overwhelming.'
            delay={0.2}
          />
          <FeatureCard
            icon={MessageSquareHeart}
            title='Real Connection'
            description="While our AI provides immediate support, we also bridge the gap to licensed professionals for deep, human-centered therapy."
            delay={0.3}
          />
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className='relative overflow-hidden bg-red-600 dark:bg-red-700 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl'
        >
          {/* Decorative elements */}
          <div className='absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl' />
          <div className='absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl' />

          <h3 className='text-3xl md:text-5xl font-extrabold mb-8 relative z-10'>
            The Future of Mental Wellness is Here
          </h3>
          <p className='text-red-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto relative z-10'>
            Join our growing community and experience how AI-driven personalized care can transform your mental well-being journey.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center relative z-10'>
            <Link to='/dynamo'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='bg-white text-red-600 font-bold py-4 px-10 rounded-2xl shadow-xl transition-all flex items-center gap-2 mx-auto justify-center'
              >
                <MessageSquareHeart className='w-5 h-5' />
                Start AI Counseling
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutUs


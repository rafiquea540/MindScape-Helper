import { motion } from 'framer-motion'
import {
  Clock,
  Heart,
  MessageCircle,
  Quote,
  Star,
  VideoIcon,
} from 'lucide-react'
import React from 'react'

const TestimonialCard = ({ name, location, text, rating, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className='bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 hover:border-red-500/30 transition-all duration-300 relative group'
  >
    <div className='absolute top-6 right-8 opacity-10 group-hover:opacity-20 transition-opacity'>
      <Quote size={40} className='text-red-500' />
    </div>

    <div className='flex gap-1 mb-6'>
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-red-500 text-red-500' : 'text-gray-300 dark:text-gray-600'}`} />
      ))}
    </div>

    <p className='text-gray-700 dark:text-gray-300 mb-8 leading-relaxed italic text-lg'>"{text}"</p>

    <div className='flex items-center gap-4'>
      <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-red-500/20'>
        {name.charAt(0)}
      </div>
      <div>
        <h4 className='font-bold text-gray-900 dark:text-white'>{name}</h4>
        <p className='text-red-500 dark:text-red-400 text-sm font-medium'>{location}</p>
      </div>
    </div>
  </motion.div>
)

const ImpactMetric = ({ icon: Icon, number, text }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className='text-center p-6'
  >
    <div className='w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4 border border-red-100 dark:border-red-900/30'>
      <Icon className='w-8 h-8 text-red-600 dark:text-red-400' />
    </div>
    <div className='text-3xl font-extrabold text-gray-900 dark:text-white mb-2'>{number}</div>
    <div className='text-gray-600 dark:text-gray-400 font-medium'>{text}</div>
  </motion.div>
)

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Zainab Ahmed',
      location: 'Lahore',
      text: 'Mindscape Helper ne meri zindagi badal di hai. App ke zariye milne wali professional madad ne mujhe depression se nikalne mein bohot support kiya.',
      rating: 5,
      delay: 0.1,
    },
    {
      name: 'Muhammad Faraz',
      location: 'Karachi',
      text: 'The AI-guided exercises and video consultations have been invaluable for managing work stress. Truly a game-changer for mental wellness.',
      rating: 5,
      delay: 0.2,
    },
    {
      name: 'Lailma Javed',
      location: 'Islamabad',
      text: "The privacy features and AI-driven personalized care gave me the confidence to seek help. Higher standard of care than I expected.",
      rating: 5,
      delay: 0.3,
    },
  ]

  return (
    <section className='bg-gray-50 dark:bg-gray-900 py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300'>
      <div className='max-w-7xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-20'
        >
          <span className='inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-red-600 uppercase bg-red-50 dark:bg-red-900/20 rounded-full'>
            Real Stories
          </span>
          <h2 className='text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6'>
            Trusted by Thousands <span className='text-red-600 dark:text-red-500'>Everywhere</span>
          </h2>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
            Join our thriving community and discover how AI-augmented mental health support is changing lives.
          </p>
        </motion.div>

        {/* Impact Metrics */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-20'>
          <ImpactMetric
            icon={MessageCircle}
            number='150k+'
            text='AI Conversations'
          />
          <ImpactMetric
            icon={VideoIcon}
            number='5000+'
            text='Expert Consults'
          />
          <ImpactMetric icon={Clock} number='24/7' text='Uptime Support' />
          <ImpactMetric icon={Heart} number='99.9%' text='Data Privacy' />
        </div>

        {/* Testimonials Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials


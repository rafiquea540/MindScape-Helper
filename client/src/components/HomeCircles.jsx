import { motion } from 'framer-motion'
import {
  Brain,
  Cpu,
  Heart,
  Network,
  Users,
} from 'lucide-react'
import React from 'react'
import CountUp from 'react-countup'

const StatCard = ({ icon: Icon, number, label, subtitle, gradient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className='relative group'
    >
      <div className='absolute -inset-2 bg-gradient-to-r from-red-500 options-none to-orange-500 rounded-[2rem] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500' />
      <div className='relative h-full bg-white dark:bg-gray-800/80 rounded-[2rem] p-8 shadow-2xl border border-gray-100 dark:border-gray-700/50 backdrop-blur-xl group-hover:border-red-500/30 transition-all duration-300'>

        <div className='flex items-center justify-between mb-8'>
          <div className={`w-16 h-16 rounded-2xl ${gradient} flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-500`}>
            <Icon className='w-8 h-8 text-white' />
          </div>
          <div className='text-4xl font-extrabold text-gray-900 dark:text-white'>
            <CountUp start={0} end={number} duration={2.5} enableScrollSpy={true}>
              {({ countUpRef }) => (
                <div className='flex items-center'>
                  <span ref={countUpRef} />
                  <span className='text-red-500 ml-1'>+</span>
                </div>
              )}
            </CountUp>
          </div>
        </div>

        <div>
          <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors'>{label}</h3>
          <p className='text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed'>{subtitle}</p>
        </div>
      </div>
    </motion.div>
  )
}

const HomeCircles = () => {
  const stats = [
    {
      icon: Heart,
      number: 12500,
      label: 'Lives Impacted',
      subtitle: 'Users supported by our AI ecosystem',
      gradient: 'bg-gradient-to-br from-red-500 to-red-600',
    },
    {
      icon: Cpu,
      number: 85000,
      label: 'AI Interactions',
      subtitle: 'Counseling pulses processed globally',
      gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
    },
    {
      icon: Brain,
      number: 150,
      label: 'Cognitive Experts',
      subtitle: 'Licensed professionals on rotation',
      gradient: 'bg-gradient-to-br from-red-600 to-red-800',
    },
    {
      icon: Network,
      number: 99,
      label: 'Success Rate (%)',
      subtitle: 'Positive outcomes in user wellness',
      gradient: 'bg-gradient-to-br from-orange-400 to-red-500',
    },
  ]

  return (
    <section className='py-32 px-4 relative overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300'>
      {/* Background patterns */}
      <div className='absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none'>
        <div className='absolute top-0 left-0 w-full h-full' style={{ backgroundImage: 'radial-gradient(#ef4444 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className='text-center mb-20'
        >
          <span className='inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-red-600 uppercase bg-red-50 dark:bg-red-900/20 rounded-full'>
            Real-Time Metrics
          </span>
          <h2 className='text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6'>
            Our Global <span className='text-red-600 dark:text-red-500'>Footprint</span>
          </h2>
          <p className='text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto font-medium'>
            Tracing the influence of intelligent mental healthcare across boundaries.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeCircles


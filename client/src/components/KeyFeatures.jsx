import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart2,
  BookOpen,
  Brain,
  Cpu,
  Fingerprint,
  Mic,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import React from 'react'

const KeyFeatures = () => {
  const features = [
    {
      icon: Cpu,
      title: 'AI Personalization',
      description:
        'Our advanced neural networks adapt to your unique needs, providing tailored support and insights for your mental journey.',
      color: 'from-red-100 via-red-200 to-red-100 dark:from-red-900/20 dark:via-red-800/20 dark:to-red-900/20',
    },
    {
      icon: Mic,
      title: 'Voice Emotion Analysis',
      description:
        'Advanced speech processing helps identify emotional states and provides real-time feedback and coping strategies.',
      color: 'from-orange-100 via-red-200 to-orange-100 dark:from-orange-900/20 dark:via-red-800/20 dark:to-orange-900/20',
    },
    {
      icon: BarChart2,
      title: 'Predictive Analytics',
      description:
        'Gain deep insights into your mental health trends with AI-powered forecasting and pattern recognition.',
      color: 'from-red-100 via-orange-200 to-red-100 dark:from-red-900/20 dark:via-orange-800/20 dark:to-red-900/20',
    },
    {
      icon: Fingerprint,
      title: 'Biometric Insights',
      description:
        'Integrate with wearable devices to monitor physiological stress responses and get proactive interventions.',
      color: 'from-orange-100 via-red-200 to-orange-100 dark:from-orange-900/20 dark:via-red-800/20 dark:to-orange-900/20',
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Private',
      description:
        'Enterprise-grade encryption and privacy-first AI ensure your sensitive data remains completely confidential.',
      color: 'from-red-100 via-orange-200 to-red-100 dark:from-red-900/20 dark:via-orange-800/20 dark:to-red-900/20',
    },
  ]

  return (
    <section className='py-24 px-4 relative overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
      {/* Ambient background effects */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-red-500/5 rounded-full blur-[120px]' />
        <div className='absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-orange-500/5 rounded-full blur-[120px]' />
      </div>

      <div className='max-w-6xl mx-auto relative'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-20'
        >
          <motion.div
            animate={{
              rotateY: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className='w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-red-500 to-orange-600 p-5 shadow-2xl relative'
          >
            <div className='absolute inset-0 bg-white/20 blur-sm rounded-3xl' />
            <Brain className='w-full h-full text-white relative z-10' />
          </motion.div>

          <h2 className='text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6'>
            AI-Powered <span className='text-red-600 dark:text-red-500'>Intelligence</span>
          </h2>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
            Explore our cutting-edge technological suite designed to augment your mental wellness journey.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className='grid gap-8'>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className='group relative'
            >
              <div className='relative flex flex-col md:flex-row items-center gap-8 p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-gray-800/50 backdrop-blur-xl border border-gray-100 dark:border-gray-700/50 hover:border-red-500/30 transition-all duration-500 shadow-xl hover:shadow-red-500/10'>
                <div className='bg-gradient-to-br from-red-500 to-orange-600 p-5 rounded-2xl shadow-lg relative overflow-hidden group-hover:scale-110 transition-transform duration-500'>
                  <div className='absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                  <feature.icon className='w-10 h-10 text-white relative z-10' />
                </div>

                <div className='flex-1 text-center md:text-left'>
                  <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300 flex items-center justify-center md:justify-start gap-2'>
                    {feature.title}
                    <Zap size={18} className='text-red-500 opacity-0 group-hover:opacity-100 transition-opacity' />
                  </h3>
                  <p className='text-lg text-gray-600 dark:text-gray-400 leading-relaxed'>
                    {feature.description}
                  </p>
                </div>

                <motion.div
                  whileHover={{ x: 10 }}
                  className='hidden md:flex p-4 rounded-full bg-gray-50 dark:bg-gray-700/50 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-all'
                >
                  <ArrowRight size={24} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mt-20'
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 px-12 rounded-2xl shadow-2xl hover:bg-black dark:hover:bg-gray-100 transition-all'
          >
            Start Your Journey Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default KeyFeatures


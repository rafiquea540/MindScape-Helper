import { motion, useScroll, useTransform } from 'framer-motion'
import { Brain, Sparkles, Zap, Activity, Shield, Cpu, ArrowRight } from 'lucide-react'
import React, { useRef } from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const y2 = useTransform(scrollY, [0, 500], [0, -150])

  return (
    <div ref={containerRef} className='relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-[#050505] transition-colors duration-500 pt-20 pb-12'>
      {/* Dynamic Background Grid */}
      <div className='absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.07]'
        style={{
          backgroundImage: `linear-gradient(#f00 1px, transparent 1px), linear-gradient(90deg, #f00 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Atmospheric Glows */}
      <div className='absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 dark:bg-red-500/10 blur-[120px] rounded-full animate-pulse' />
      <div className='absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/5 dark:bg-orange-500/5 blur-[120px] rounded-full' />

      <div className='container mx-auto px-6 relative z-10'>
        <div className='grid lg:grid-cols-2 gap-16 items-center'>

          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className='flex flex-col space-y-8'
          >
            <div className='inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 w-fit'>
              <div className='w-2 h-2 rounded-full bg-red-500 animate-ping' />
              <span className='text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest'>Core Engine Active</span>
            </div>

            <h1 className='text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-gray-900 dark:text-white'>
              <span className='block mb-2 overflow-hidden'>
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className='block'
                >
                  DECODE YOUR
                </motion.span>
              </span>
              <span className='block text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-500 dark:from-red-400 dark:via-red-500 dark:to-orange-400'>
                INNER PULSE
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className='text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed font-medium'
            >
              The world's first autonomous neural wellness companion.
              Real-time synchronization with your emotional peak.
            </motion.p>

            <div className='flex flex-wrap gap-4'>
              <Link to='/register'>
                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className='px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-full shadow-[0_0_30px_rgba(239, 68, 68, 0.4)] flex items-center gap-3 group transition-all duration-300'
                >
                  INITIALIZE ACCESS
                  <ArrowRight size={20} className='group-hover:translate-x-1 transition-transform' />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                className='px-8 py-4 border-2 border-red-600 text-red-600 dark:text-red-400 font-bold rounded-full transition-all'
              >
                VIEW DOCS
              </motion.button>
            </div>

            {/* Performance Stats */}
            <div className='grid grid-cols-3 gap-8 pt-10 border-t border-gray-200 dark:border-gray-800'>
              <div>
                <div className='text-2xl font-black text-gray-900 dark:text-white'>99.9%</div>
                <div className='text-xs font-bold text-gray-400 uppercase'>Accuracy</div>
              </div>
              <div>
                <div className='text-2xl font-black text-gray-900 dark:text-white'>&lt;10ms</div>
                <div className='text-xs font-bold text-gray-400 uppercase'>Latency</div>
              </div>
              <div>
                <div className='text-2xl font-black text-gray-900 dark:text-white'>12M+</div>
                <div className='text-xs font-bold text-gray-400 uppercase'>Data Points</div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Visual Core */}
          <div className='relative flex items-center justify-center'>
            <motion.div
              style={{ y: y1 }}
              className='relative w-full aspect-square max-w-[500px]'
            >
              {/* Spinning Rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className='absolute inset-0 border-[1px] border-red-500/20 rounded-full'
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className='absolute inset-10 border-[1px] border-red-500/10 rounded-full border-dashed'
              />

              {/* Brain Core Visualization */}
              <div className='absolute inset-0 flex items-center justify-center'>
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 0 40px rgba(239, 68, 68, 0.2)",
                      "0 0 80px rgba(239, 68, 68, 0.4)",
                      "0 0 40px rgba(239, 68, 68, 0.2)"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className='w-64 h-64 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center p-1 relative z-20 overflow-hidden group shadow-2xl'
                >
                  <div className='absolute inset-0 bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")] opacity-20' />
                  <motion.div
                    animate={{ rotateY: [0, 180, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain size={120} className='text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' />
                  </motion.div>
                </motion.div>

                {/* Orbital Status Cards */}
                <motion.div
                  style={{ y: y2 }}
                  className='absolute top-0 right-[-20px] bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl hidden md:block'
                >
                  <Activity size={24} className='text-red-500 mb-2' />
                  <div className='text-white font-bold'>Sync Status</div>
                  <div className='text-red-400 text-xs font-black uppercase'>Optimized</div>
                </motion.div>

                <motion.div
                  animate={{
                    x: [0, -10, 0],
                    y: [0, 20, 0]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className='absolute bottom-10 left-[-40px] bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl hidden md:block'
                >
                  <Shield size={24} className='text-orange-500 mb-2' />
                  <div className='text-white font-bold'>End-to-End</div>
                  <div className='text-orange-400 text-xs font-black uppercase'>Encrypted</div>
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, -30, 0]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className='absolute bottom-[-20px] right-10 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl hidden md:block'
                >
                  <Cpu size={24} className='text-white mb-2' />
                  <div className='text-white font-bold'>Neural Node</div>
                  <div className='text-gray-400 text-xs font-black uppercase'>v4.0.2</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trust Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className='absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-30'
      >
        <div className='w-[1px] h-12 bg-red-600' />
        <span className='text-[10px] font-black uppercase tracking-[0.3em] mt-2 rotate-90'>Scroll</span>
      </motion.div>
    </div>
  )
}

export default Hero



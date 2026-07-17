import { AnimatePresence, motion } from 'framer-motion'
import jwt_decode from 'jwt-decode'
import {
  Bell,
  Brain,
  Calendar,
  ChevronDown,
  LogOut,
  Menu,
  MessageSquareHeart,
  Moon,
  Shield,
  Stethoscope,
  Sun,
  User,
  UserCircle,
  Users,
  X,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import { useTheme } from '../context/ThemeContext'
import { setUserInfo } from '../redux/reducers/rootSlice'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(
    localStorage.getItem('token')
      ? jwt_decode(localStorage.getItem('token'))
      : ''
  )
  const { darkMode, toggleDarkMode } = useTheme()

  const getUserRoleInfo = () => {

    if (user.isAdmin) {
      return {
        icon: Shield,
        text: 'Admin',
        bgColor: 'bg-red-500/10 dark:bg-red-400/10',
        textColor: 'text-red-600 dark:text-red-400',
      }
    }
    if (user.isDoctor) {
      return {
        icon: Stethoscope,
        text: 'Doctor',
        bgColor: 'bg-red-500/10 dark:bg-red-400/10',
        textColor: 'text-red-600 dark:text-red-400',
      }
    }
    return {
      icon: User,
      text: 'Patient',
      bgColor: 'bg-red-500/10 dark:bg-red-400/10',
      textColor: 'text-red-600 dark:text-red-400',
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const logoutFunc = () => {
    dispatch(setUserInfo({}))
    localStorage.removeItem('token')
    navigate('/login')
  }

  const getHomeRoute = () => {
    if (user.isAdmin) return '/dashboard/analytics'
    if (user.isDoctor) return '/doctor-home'
    return '/patient-home'
  }

  const UserInfo = ({ isMobile = false }) => {
    const {
      icon: RoleIcon,
      text: roleText,
      bgColor,
      textColor,
    } = getUserRoleInfo()

    return (
      <motion.div
        whileHover={{ scale: isMobile ? 1 : 1.02 }}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          ${bgColor} ${textColor}
          transition-all duration-200
          ${isMobile ? 'mx-2' : ''}
        `}
      >
        <UserCircle className='w-5 h-5' />
        <span className='font-medium'>{user.firstname}</span>
        <div className={`flex items-center gap-1 text-sm ${textColor}`}>
          <span>•</span>
          <RoleIcon className='w-4 h-4' />
          <span className='text-sm'>{roleText}</span>
        </div>
      </motion.div>
    )
  }

  const NavItem = ({ to, icon: Icon, children, onClick }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
          ? 'bg-red-500/10 text-red-500 dark:bg-red-400/10 dark:text-red-400'
          : 'text-gray-600 dark:text-gray-300 hover:bg-red-500/5 hover:text-red-600 dark:hover:bg-red-400/5 dark:hover:text-red-400'
        }`
      }
      onClick={onClick}
    >
      {Icon && <Icon className='w-4 h-4' />}
      {children}
    </NavLink>
  )

  const MobileNavItem = ({ to, icon: Icon, children, onClick }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive
          ? 'bg-red-500/10 text-red-500 dark:bg-red-400/10 dark:text-red-400'
          : 'text-gray-600 dark:text-gray-300 hover:bg-red-500/5 hover:text-red-600 dark:hover:bg-red-400/5 dark:hover:text-red-400'
        }`
      }
      onClick={() => {
        setIsMobileMenuOpen(false)
        onClick?.()
      }}
    >
      {Icon && <Icon className='w-5 h-5' />}
      {children}
    </NavLink>
  )

  const navbarClasses = `
    fixed top-0 w-full z-50 transition-all duration-300
    ${scrolled
      ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md'
      : 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm'
    }
  `

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={navbarClasses}
    >
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className='flex items-center'
          >
            <NavLink
              to='/'
              className='flex items-center gap-2 font-bold text-xl text-red-600 dark:text-red-500'
            >
              <Brain className='w-6 h-6' />
              <span>MindscapeHelper</span>
            </NavLink>
          </motion.div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-2'>
            <NavItem to={getHomeRoute()} icon={MessageSquareHeart}>
              Home
            </NavItem>
            {!user.isDoctor && (
              <NavItem to='/doctors' icon={Users}>
                Doctors
              </NavItem>
            )}

            {token && !user.isAdmin && !user.isDoctor && (
              <>
                <NavItem to='/appointments' icon={Calendar}>
                  Appointments
                </NavItem>
                <div className='relative'>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className='flex items-center gap-1 px-3 py-2 rounded-lg text-gray-600 hover:bg-green-500/5 hover:text-green-600'
                  >
                    More
                    <ChevronDown className='w-4 h-4' />
                  </button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border dark:border-gray-700'
                        onMouseLeave={() => setIsDropdownOpen(false)}
                      >
                        <NavItem to='/notifications' icon={Bell}>
                          Notifications
                        </NavItem>
                        <NavItem to='/applyfordoctor'>Apply as Doctor</NavItem>
                        <NavItem to='/#contact' as={HashLink}>
                          Contact Us
                        </NavItem>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {token && user.isDoctor && (
              <>
                <NavItem to='/appointments' icon={Calendar}>
                  Appointments
                </NavItem>
                <NavItem to='/slots' icon={Calendar}>
                  Time Slots
                </NavItem>
              </>
            )}

            {token && user.isAdmin && (
              <NavItem to='/dashboard/analytics'>Dashboard</NavItem>
            )}

            <div className='flex items-center gap-2'>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                className='p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-500/5 dark:hover:bg-red-400/5'
              >
                {darkMode ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
              </motion.button>

              {!token ? (
                <div className='flex items-center gap-2'>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className='px-4 py-2 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20'
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className='px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 active:bg-red-800'
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </motion.button>
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <UserInfo />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={logoutFunc}
                    className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700'
                  >
                    <LogOut className='w-4 h-4' />
                    Logout
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='md:hidden p-2 rounded-lg hover:bg-red-500/5 dark:hover:bg-red-400/5'
          >
            {isMobileMenuOpen ? (
              <X className='w-6 h-6 text-gray-600 dark:text-gray-300' />
            ) : (
              <Menu className='w-6 h-6 text-gray-600 dark:text-gray-300' />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='md:hidden overflow-hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800'
            >
              <div className='px-2 pt-2 pb-3 space-y-1'>
                {token && (
                  <div className='p-2'>
                    <UserInfo isMobile={true} />
                  </div>
                )}
                <MobileNavItem to={getHomeRoute()} icon={MessageSquareHeart}>
                  Home
                </MobileNavItem>
                {!user.isDoctor && (
                  <MobileNavItem to='/doctors' icon={Users}>
                    Doctors
                  </MobileNavItem>
                )}

                {token && !user.isAdmin && !user.isDoctor && (
                  <>
                    <MobileNavItem to='/appointments' icon={Calendar}>
                      Appointments
                    </MobileNavItem>
                    <MobileNavItem to='/notifications' icon={Bell}>
                      Notifications
                    </MobileNavItem>
                    <MobileNavItem to='/applyfordoctor'>
                      Apply as Doctor
                    </MobileNavItem>
                    <MobileNavItem to='/#contact' as={HashLink}>
                      Contact Us
                    </MobileNavItem>
                  </>
                )}

                {token && user.isDoctor && (
                  <>
                    <MobileNavItem to='/appointments' icon={Calendar}>
                      Appointments
                    </MobileNavItem>
                    <MobileNavItem to='/slots' icon={Calendar}>
                      Time Slots
                    </MobileNavItem>
                  </>
                )}

                {token && user.isAdmin && (
                  <MobileNavItem to='/dashboard/analytics'>
                    Dashboard
                  </MobileNavItem>
                )}

                <div className='pt-4 border-t dark:border-gray-800'>
                  <button
                    onClick={toggleDarkMode}
                    className='flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-red-500/5 dark:hover:bg-red-400/5'
                  >
                    {darkMode ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </button>

                  {!token ? (
                    <div className='flex flex-col gap-2 p-2'>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className='w-full px-4 py-2 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20'
                        onClick={() => {
                          navigate('/login')
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        Login
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className='w-full px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700'
                        onClick={() => {
                          navigate('/register')
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        Register
                      </motion.button>
                    </div>
                  ) : (
                    <div className='p-2'>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          logoutFunc()
                          setIsMobileMenuOpen(false)
                        }}
                        className='flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700'
                      >
                        <LogOut className='w-4 h-4' />
                        Logout
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}

export default Navbar

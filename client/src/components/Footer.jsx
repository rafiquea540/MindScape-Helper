import {
  Bell,
  Calendar,
  Facebook,
  Home,
  Instagram,
  Linkedin,
  MessageSquare,
  Twitter,
  User,
  Users,
} from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const FooterLink = ({ to, icon: Icon, text }) => (
  <Link
    to={to}
    className='flex flex-col items-center text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-300'
  >
    <Icon size={20} />
    <span className='mt-1 text-xs font-medium uppercase tracking-wider'>{text}</span>
  </Link>
)

const SocialLink = ({ href, icon: Icon }) => (
  <a
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    className='w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all duration-300'
  >
    <Icon size={20} />
  </a>
)

const Layout = ({ children }) => (
  <div className='min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300'>
    <main className='flex-grow'>{children}</main>
    <Footer />
  </div>
)

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-3 md:grid-cols-6 gap-8 mb-12'>
          <FooterLink to='/' icon={Home} text='Home' />
          <FooterLink to='/doctors' icon={Users} text='Doctors' />
          <FooterLink to='/appointments' icon={Calendar} text='Events' />
          <FooterLink to='/notifications' icon={Bell} text='Alerts' />
          <FooterLink to='/#contact' icon={MessageSquare} text='Pulse' />
          <FooterLink to='/profile' icon={User} text='Aura' />
        </div>

        <div className='flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-800 gap-8'>
          <div className='space-y-2 text-center md:text-left'>
            <p className='text-lg font-bold text-gray-900 dark:text-white'>
              MindScape <span className='text-red-600'>AI</span>
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400 font-medium'>
              &copy; {currentYear} Cognitive Evolution. Crafted by AI Pioneers.
            </p>
          </div>

          <div className='flex space-x-3'>
            <SocialLink href='https://facebook.com' icon={Facebook} />
            <SocialLink href='https://twitter.com' icon={Twitter} />
            <SocialLink href='https://instagram.com' icon={Instagram} />
            <SocialLink href='https://linkedin.com' icon={Linkedin} />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Layout


import React from 'react'
import AboutUs from '../components/AboutUs'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import HomeCircles from '../components/HomeCircles'
import KeyFeatures from '../components/KeyFeatures'
import Navbar from '../components/Navbar'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <AboutUs />
      <Testimonials />
      <KeyFeatures />
      <HomeCircles />
      <FAQ />
      <Contact />
      <Footer />
    </>
  )
}

export default Home

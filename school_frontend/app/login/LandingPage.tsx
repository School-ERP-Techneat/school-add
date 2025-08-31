import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import NewsSection from '../components/NewsSection'

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />
      <main>
        <HeroSection />
        <AboutSection />
        <NewsSection />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage

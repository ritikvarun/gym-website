import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Programs from './components/Programs'
import About from './components/About'
import Services from './components/Services'
import WhyChooseUs from './components/WhyChooseUs'
import Transformations from './components/Transformations'
import Trainers from './components/Trainers'
import Pricing from './components/Pricing'
import Testimonials from './components/Testimonials'
import Gallery from './components/Gallery'
import CTA from './components/CTA'
import Footer from './components/Footer'
import Preloader from './components/Preloader'
import CustomCursor from './components/CustomCursor'

const App = () => {
  const [loading, setLoading] = React.useState(true)

  return (
    <>
      <CustomCursor />
      <Preloader onComplete={() => setLoading(false)} />
      <div className={`bg-dark-bg min-h-screen text-gray-100 selection:bg-neon-lime selection:text-black transition-opacity duration-1000 ${
        loading ? 'opacity-0' : 'opacity-100'
      }`}>
        {/* Header / Navigation */}
        <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Programs / Showcase Section */}
      <Programs />
      
      {/* About Us Section */}
      <About />
      
      {/* Services Section */}
      <Services />
      
      {/* Why Choose Us Section */}
      <WhyChooseUs />
      
      {/* Transformations Section */}
      <Transformations />
      
      {/* Trainers Section */}
      <Trainers />
      
      {/* Pricing Section */}
      <Pricing />
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Gallery Section */}
      <Gallery />
      
      {/* Call to Action Section */}
      <CTA />
      
      {/* Footer Section */}
      <Footer />
    </div>
    </>
  )
}

export default App
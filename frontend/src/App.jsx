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
      
      {/* Gallery Section */}
      <Gallery />
      
      {/* About Us Section */}
      <About />
      
      {/* Why Choose Us Section */}
      <WhyChooseUs />
      
      {/* Services Section */}
      <Services />
      
      {/* Trainers Section */}
      <Trainers />
      
      {/* Programs / Showcase Section */}
      <Programs />
      
      {/* Pricing Section */}
      <Pricing />
      
      {/* Transformations Section */}
      <Transformations />
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Call to Action Section */}
      <CTA />
      
      {/* Footer Section */}
      <Footer />
    </div>
    </>
  )
}

export default App
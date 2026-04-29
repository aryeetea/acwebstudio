import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import Services from './pages/Services'
// ...existing code...
import Contact from './pages/Contact'
import Faq from './pages/Faq'
// Team import removed
import { roseNoirTheme } from './theme'

export default function App() {
  return (
    <div style={{ ...roseNoirTheme.colors, minHeight: '100vh', background: 'var(--cream)' }}>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/about"     element={<AboutUs />} />
        <Route path="/services"  element={<Services />} />
        {/* Portfolio route removed */}
        {/* Team route removed, merged into AboutUs */}
        <Route path="/faq"       element={<Faq />} />
        <Route path="/contact"   element={<Contact />} />
      </Routes>
      <Footer />
    </div>
  )
}

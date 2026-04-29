import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'
import Faq from './pages/Faq'
import Team from './pages/Team'
import { roseNoirTheme } from './theme'

export default function App() {
  return (
    <div style={{ ...roseNoirTheme.colors, minHeight: '100vh', background: 'var(--cream)' }}>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/about"     element={<About />} />
        <Route path="/services"  element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/team"      element={<Team />} />
        <Route path="/faq"       element={<Faq />} />
        <Route path="/contact"   element={<Contact />} />
      </Routes>
      <Footer />
    </div>
  )
}

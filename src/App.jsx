import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import Admin from './pages/Admin'
import Contact from './pages/Contact'
import Faq from './pages/Faq'
import Checkout from './pages/Checkout'
import CheckoutSuccess from './pages/CheckoutSuccess'
import CheckoutCancel from './pages/CheckoutCancel'
// Team import removed
export default function App() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/about"     element={<AboutUs />} />
        <Route path="/services"  element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/admin"     element={<Admin />} />
        <Route path="/checkout"  element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout/cancel" element={<CheckoutCancel />} />
        <Route path="/orders"    element={<Navigate to="/checkout" replace />} />
        <Route path="/faq"       element={<Faq />} />
        <Route path="/contact"   element={<Contact />} />
      </Routes>
      <Footer />
    </div>
  )
}

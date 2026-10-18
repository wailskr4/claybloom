
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Technique from './pages/Technique'
import Home from './pages/Home'
import Creations from './pages/Creations'
import Tutoriels from './pages/Tutoriels'
import TutorialDetail from './pages/TutorialDetail'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import './i18n'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/creations" element={<Creations />} />
        <Route path="/tutoriels" element={<Tutoriels />} />
        <Route path="/tutoriels/:id" element={<TutorialDetail />} />
        <Route path='/technique' element={<Technique />}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}


import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Creations from './pages/Creations'
import TutorialDetail from './pages/TutorialDetail'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
export default function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/creations" element={<Creations />} />
        <Route
          path="/tutoriels/:id"
          element={<TutorialDetail />}
        />
      </Routes>
    </BrowserRouter>
  )
}

import  {useState} from "react";
import { Link } from 'react-router-dom'
import Logo from '../assets/logo2.jpg'
import {   Sparkles, X, Menu } from "lucide-react";
export default  function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-pink-100/70 bg-[#fffaf6]/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2.5"
        >
          

          <span>
        
<Link to="/" className="flex shrink-0 items-center gap-2">
  <img
    src={Logo}
    alt="ClayBloom"
    className="h-10 w-auto object-fit sm:h-14"
    draggable="false"
  />
</Link>

            <span className="hidden text-[10px] text-[#998590] sm:block">
              Crée, modèle, fais fleurir ta créativité
            </span>
          </span>
        </Link>

        {/* Navigation ordinateur */}
        <div className="hidden items-center gap-7 text-sm font-medium text-[#766474] md:flex">
          <Link to="/" className="text-pink-500">
            Accueil
          </Link>

          <Link
            to="/creations"
            className="transition hover:text-pink-500"
          >
            Créations
          </Link>

          <Link
            to="/tutoriels"
            className="transition hover:text-pink-500"
          >
            Tutoriels
          </Link>

          <Link
            to="/technique"
            className="transition hover:text-pink-500"
          >
            Techniques
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/creations"
            aria-label="Rechercher une création"
            className="hidden rounded-full p-2.5 text-[#766474] transition hover:bg-pink-50 sm:block"
          >
            <Sparkles size={19} />
          </Link>

          <Link
            to="/creations"
            className="hidden rounded-full bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-pink-200 transition hover:bg-pink-600 sm:inline-flex"
          >
            Commencer
          </Link>

          <button
            type="button"
            aria-label={
              mobileMenuOpen
                ? 'Fermer le menu'
                : 'Ouvrir le menu'
            }
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="rounded-xl p-2 text-[#493747] transition hover:bg-pink-50 md:hidden"
          >
            {mobileMenuOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="absolute inset-x-0 top-full border-b border-pink-100 bg-[#fffaf6] px-6 py-5 shadow-xl md:hidden">
          <div className="flex flex-col gap-4 text-base font-medium text-[#766474]">
            <Link
              to="/"
              onClick={closeMenu}
              className="text-pink-500"
            >
              Accueil
            </Link>

            <Link
              to="/creations"
              onClick={closeMenu}
              className="transition hover:text-pink-500"
            >
              Créations
            </Link>

            <Link
              to="/tutoriels"
              onClick={closeMenu}
              className="transition hover:text-pink-500"
            >
              Tutoriels
            </Link>

            <Link
              to="/technique"
              onClick={closeMenu}
              className="transition hover:text-pink-500"
            >
              Techniques
            </Link>

            <Link
              to="/creations"
              onClick={closeMenu}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-pink-200"
            >
              Explorer les créations
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Flower2,
  Heart,

  Sparkles,
  Star,
} from 'lucide-react'

import { categories } from '../data/categories'
import { tutorials } from '../data/tutorials'
import { techniques } from '../data/techniques'

import TutorialCard from '../components/TutorialCard'

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-7">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-pink-500">
        {eyebrow}
      </p>

      <h2 className="text-2xl font-bold tracking-tight text-[#493747] sm:text-3xl">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#887985] sm:text-base">
        {description}
      </p>
    </div>
  )
}



function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
      <div>
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white px-4 py-2 text-xs font-semibold text-pink-600 shadow-sm sm:text-sm">
          <Sparkles size={16} />
          Ton petit atelier créatif
        </span>

        <h1 className="max-w-xl text-4xl font-extrabold leading-[1.13] tracking-tight text-[#493747] sm:text-5xl lg:text-6xl">
          De petites idées,
          <span className="mt-2 block text-pink-500">
            de grandes créations.
          </span>
        </h1>

        <p className="mt-6 max-w-lg text-base leading-8 text-[#887985] sm:text-lg">
          Découvre comment transformer de la pâte à modeler
          en fleurs délicates, figurines kawaii et petits objets
          adorables. Un pas à la fois, à ton rythme.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/creations"
            className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-pink-600"
          >
            Explorer les tutoriels
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/creations"
            className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white px-6 py-3.5 text-sm font-semibold text-[#766474] transition hover:bg-pink-50"
          >
            Découvrir les créations
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#887985]">
          <span className="flex items-center gap-2">
            <Heart size={16} className="text-pink-500" />
            Facile à suivre
          </span>

          <span className="flex items-center gap-2">
            <Star size={16} className="text-amber-400" />
            Pour débuter
          </span>

          <span className="flex items-center gap-2">
            <Flower2 size={16} className="text-green-600" />
            100 % créativité
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-pink-100 via-purple-100 to-amber-50 blur-2xl" />

        <div className="relative overflow-hidden rounded-[2rem] border-4 border-white shadow-xl shadow-pink-100">
          <img
            src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85"
            alt="Composition florale aux couleurs douces"
            className="h-[340px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[440px]"
          />

          <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-lg backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-pink-500">
                  LE PROJET DU MOMENT
                </p>

                <p className="mt-1 font-bold text-[#493747]">
                  Un bouquet tout doux
                </p>

                <p className="mt-1 text-xs text-[#887985]">
                  8 étapes · Niveau débutant
                </p>
              </div>

              <Link
                to="/creations"
                aria-label="Découvrir les créations"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-500 text-white transition hover:bg-pink-600"
              >
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute -right-2 -top-4 flex h-16 w-16 animate-bounce items-center justify-center rounded-2xl bg-white text-pink-500 shadow-lg sm:-right-5 sm:top-8">
          <Flower2 size={34} />
        </div>
      </div>
    </section>
  )
}

function Categories() {
  return (
    <section
      id="categories"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 lg:px-8"
    >
      <SectionHeading
        eyebrow="Ton univers créatif"
        title="Qu'as-tu envie de créer ?"
        description="Choisis ce qui t'inspire et trouve ton prochain petit projet."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.title}
            to="/creations"
            className="group overflow-hidden rounded-2xl border border-pink-100/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-100/70"
          >
            <div className={`overflow-hidden ${category.color}`}>
              <img
                src={category.image}
                alt={category.title}
                loading="lazy"
                className="h-32 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-36"
              />
            </div>

            <div className="p-3">
              <h3 className="text-sm font-bold text-[#493747]">
                {category.title}
              </h3>

              <p className="mt-1 text-xs text-[#998590]">
                {category.count}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/creations"
          className="inline-flex items-center gap-2 text-sm font-bold text-pink-600 transition hover:text-pink-700"
        >
          Voir toutes les créations
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  )
}

function Tutorials() {
  const [favorites, setFavorites] = useState({})

  const toggleFavorite = (id) => {
    setFavorites((previous) => ({
      ...previous,
      [id]: !previous[id],
    }))
  }

  return (
    <section
      id="tutoriels"
      className="scroll-mt-24 bg-gradient-to-br from-pink-50/80 to-purple-50/70 py-14 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Les favoris de l'atelier"
          title="Des créations à essayer"
          description="Des tutoriels pour apprendre progressivement et prendre plaisir à modeler."
        />

        {tutorials.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tutorials.slice(0, 3).map((tutorial) => (
              <TutorialCard
                key={tutorial.id}
                tutorial={tutorial}
                isFavorite={Boolean(favorites[tutorial.id])}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-white p-6 text-center text-[#887985]">
            Nos premiers tutoriels arrivent bientôt !
          </p>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/creations"
            className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-6 py-3 font-semibold text-pink-600 transition hover:bg-pink-50"
          >
            Explorer tous les tutoriels
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function Techniques() {
  return (
    <section
      id="techniques"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 lg:px-8"
    >
      <div className="grid items-center gap-8 rounded-[2rem] bg-[#F4EAFB] p-6 shadow-sm sm:p-10 lg:grid-cols-2 lg:p-12">
        <div>
          <span className="text-sm font-semibold tracking-wider text-purple-600">
            ON APPREND ENSEMBLE
          </span>

          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#493747] sm:text-4xl">
            Les petites techniques qui changent tout.
          </h2>

          <p className="mt-4 max-w-lg leading-7 text-[#887985]">
            Avant de créer des figurines, découvre les gestes
            essentiels du modelage grâce à des explications
            simples et illustrées.
          </p>

          <Link
            to="/techniques"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-purple-500 px-6 py-3 font-semibold text-white shadow-md shadow-purple-200 transition hover:bg-purple-600"
          >
            Explorer les techniques
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {techniques.map((technique, index) => (
            <div
              key={technique}
              className="flex min-h-32 flex-col justify-between rounded-2xl border border-white bg-white/80 p-4 shadow-sm transition hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 font-bold text-pink-600">
                {String(index + 1).padStart(2, '0')}
              </span>

              <p className="mt-4 text-sm font-bold text-[#493747]">
                {technique}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-pink-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Link to="/" className="text-xl font-extrabold text-[#493747]">
          Clay<span className="text-pink-500">Bloom</span> 🌸
        </Link>

        <p className="text-sm text-[#998590]">
          Un petit pas aujourd'hui, une grande création demain.
        </p>

        <p className="text-xs text-[#998590]">
          © {new Date().getFullYear()} ClayBloom
        </p>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FFFAF6] font-sans">
      

      <main>
        <Hero />
        <Categories />
        <Tutorials />
        <Techniques />
      </main>

      <Footer />
    </div>
  )
}

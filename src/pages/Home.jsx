
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Flower2,
  Heart,
  Sparkles,
  Star,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { categories } from '../data/categories'
import { tutorials } from '../data/tutorials'
import { techniques } from '../data/techniques'

import TutorialCard from '../components/TutorialCard'
import useFavorites from '../hooks/useFavorites'

// Titre réutilisable des sections
function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-7">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-pink-500 dark:text-pink-300">
        {eyebrow}
      </p>

      <h2 className="text-2xl font-bold tracking-tight text-[#493747] dark:text-[#F7E8EF] sm:text-3xl">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#887985] dark:text-[#C9BCCC] sm:text-base">
        {description}
      </p>
    </div>
  )
}

// Section principale
function Hero() {
  const { t } = useTranslation()

  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
      <div>
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white px-4 py-2 text-xs font-semibold text-pink-600 shadow-sm dark:border-[#493B52] dark:bg-[#30293A] dark:text-pink-300 sm:text-sm">
          <Sparkles size={16} />
          {t('home.heroBadge')}
        </span>

        <h1 className="max-w-xl text-4xl font-extrabold leading-[1.13] tracking-tight text-[#493747] dark:text-[#F7E8EF] sm:text-5xl lg:text-6xl">
          {t('home.heroTitle')}
          <span className="mt-2 block text-pink-500 dark:text-pink-300">
            {t('home.heroTitleAccent')}
          </span>
        </h1>

        <p className="mt-6 max-w-lg text-base leading-8 text-[#887985] dark:text-[#C9BCCC] sm:text-lg">
          {t('home.heroDescription')}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/creations"
            className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-pink-600 dark:shadow-none"
          >
            {t('home.exploreTutorials')}
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/techniques"
            className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white px-6 py-3.5 text-sm font-semibold text-[#766474] transition hover:bg-pink-50 dark:border-[#493B52] dark:bg-[#30293A] dark:text-[#F7E8EF] dark:hover:bg-[#403448]"
          >
            {t('home.learnTechniques')}
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#887985] dark:text-[#C9BCCC]">
          <span className="flex items-center gap-2">
            <Heart size={16} className="text-pink-500 dark:text-pink-300" />
            {t('home.easyToFollow')}
          </span>

          <span className="flex items-center gap-2">
            <Star size={16} className="text-amber-400" />
            {t('home.beginnerFriendly')}
          </span>

          <span className="flex items-center gap-2">
            <Flower2 size={16} className="text-green-500 dark:text-green-400" />
            {t('home.creative')}
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-pink-100 via-purple-100 to-amber-50 blur-2xl dark:from-pink-950/30 dark:via-purple-950/30 dark:to-amber-950/20" />

        <div className="relative overflow-hidden rounded-4xl border-4 border-white shadow-xl shadow-pink-100 dark:border-[#493B52] dark:shadow-black/20">
          <img
            src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85"
            alt={t('home.featuredTitle')}
            className="h-80 w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-110"
          />

          <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-lg backdrop-blur-md dark:border-[#55445F]/80 dark:bg-[#211D2B]/90 sm:inset-x-6 sm:bottom-6 sm:p-5">
            <p className="text-xs font-semibold text-pink-500 dark:text-pink-300">
              {t('home.featuredLabel')}
            </p>

            <div className="mt-1 flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-[#493747] dark:text-[#F7E8EF]">
                  {t('home.featuredTitle')}
                </p>

                <p className="mt-1 text-xs text-[#887985] dark:text-[#C9BCCC]">
                  {t('home.featuredDescription')}
                </p>
              </div>

              <Link
                to="/creations"
                aria-label={t('home.exploreTutorials')}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-500 text-white transition hover:bg-pink-600"
              >
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute -right-2 -top-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-pink-500 shadow-lg dark:bg-[#30293A] dark:text-pink-300 sm:-right-5 sm:top-8 sm:h-16 sm:w-16">
          <Flower2 size={32} />
        </div>
      </div>
    </section>
  )
}

// Section des catégories
function Categories() {
  const { t } = useTranslation()

  return (
    <section
      id="categories"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 lg:px-8"
    >
      <SectionHeading
        eyebrow={t('home.categoriesEyebrow')}
        title={t('home.categoriesTitle')}
        description={t('home.categoriesDescription')}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.title}
            to={`/creations?category=${encodeURIComponent(category.title)}`}
            className="group overflow-hidden rounded-2xl border border-pink-100/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-100/70 dark:border-[#493B52] dark:bg-[#30293A] dark:hover:shadow-black/20"
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
              <h3 className="text-sm font-bold text-[#493747] dark:text-[#F7E8EF]">
                {category.title}
              </h3>

              <p className="mt-1 text-xs text-[#998590] dark:text-[#C9BCCC]">
                {category.count}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/creations"
          className="inline-flex items-center gap-2 text-sm font-bold text-pink-600 transition hover:text-pink-700 dark:text-pink-300 dark:hover:text-pink-200"
        >
          {t('home.viewAllCreations')}
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  )
}

// Section des tutoriels
function Tutorials() {
  const { t } = useTranslation()
  const { favorites, toggleFavorite } = useFavorites()

  return (
    <section
      id="tutoriels"
      className="scroll-mt-24 bg-gradient-to-br from-pink-50/80 to-purple-50/70 py-14 transition-colors duration-300 dark:from-[#282231] dark:to-[#302638] sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t('home.tutorialsEyebrow')}
          title={t('home.tutorialsTitle')}
          description={t('home.tutorialsDescription')}
        />

        {tutorials.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tutorials.slice(0, 3).map((tutorial) => (
              <TutorialCard
                key={tutorial.id}
                tutorial={tutorial}
                isFavorite={favorites.includes(String(tutorial.id))}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-white p-6 text-center text-[#887985] dark:bg-[#30293A] dark:text-[#C9BCCC]">
            {t('home.emptyTutorials')}
          </p>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/creations"
            className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-6 py-3 font-semibold text-pink-600 transition hover:bg-pink-50 dark:border-[#55445F] dark:bg-[#30293A] dark:text-pink-300 dark:hover:bg-[#403448]"
          >
            {t('home.viewAllTutorials')}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// Section des techniques
function Techniques() {
  const { t } = useTranslation()

  return (
    <section
      id="techniques"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 lg:px-8"
    >
      <div className="grid items-center gap-8 rounded-4xl bg-[#F4EAFB] p-6 shadow-sm transition-colors duration-300 dark:bg-[#302638] sm:p-10 lg:grid-cols-2 lg:p-12">
        <div>
          <span className="text-sm font-semibold tracking-wider text-purple-600 dark:text-purple-300">
            {t('home.techniquesEyebrow')}
          </span>

          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#493747] dark:text-[#F7E8EF] sm:text-4xl">
            {t('home.techniquesTitle')}
          </h2>

          <p className="mt-4 max-w-lg leading-7 text-[#887985] dark:text-[#C9BCCC]">
            {t('home.techniquesDescription')}
          </p>

          <Link
            to="/techniques"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-purple-500 px-6 py-3 font-semibold text-white shadow-md shadow-purple-200 transition hover:bg-purple-600 dark:shadow-none"
          >
            {t('home.exploreTechniques')}
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {techniques.map((technique, index) => (
            <div
              key={technique}
              className="flex min-h-32 flex-col justify-between rounded-2xl border border-white bg-white/80 p-4 shadow-sm transition hover:shadow-md dark:border-[#55445F] dark:bg-[#211D2B]/70"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 font-bold text-pink-600 dark:bg-[#493344] dark:text-pink-300">
                {String(index + 1).padStart(2, '0')}
              </span>

              <p className="mt-4 text-sm font-bold text-[#493747] dark:text-[#F7E8EF]">
                {technique}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Page d'accueil
export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FFFAF6] font-sans text-[#493747] transition-colors duration-300 dark:bg-[#211D2B] dark:text-[#F7E8EF]">
      <main>
        <Hero />
        <Categories />
        <Tutorials />
        <Techniques />
      </main>
    </div>
  )
}

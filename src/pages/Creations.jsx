import { useMemo, useState } from 'react'
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Heart,
} from 'lucide-react'
import useTutorialProgress from '../hooks/useTutorialProgress'
import { categories } from '../data/categories'
import { tutorials } from '../data/tutorials'
import TutorialCard from '../components/TutorialCard'
import useFavorites from '../hooks/useFavorites'

export default function Creations() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Toutes')
  const [level, setLevel] = useState('Tous')
  const [view, setView] = useState('all')

  const {
    favorites,
    favoritesCount,
    isFavorite,
    toggleFavorite,
  } = useFavorites()

  const { progress: tutorialProgress } =
    useTutorialProgress(tutorials)

  const [progressFilter, setProgressFilter] = useState('Tous')

  const filteredTutorials = useMemo(() => {
    return tutorials.filter((tutorial) => {
      const matchesSearch = tutorial.title
        .toLowerCase()
        .includes(search.trim().toLowerCase())

      const matchesCategory =
        category === 'Toutes' ||
        tutorial.category === category

      const matchesLevel =
        level === 'Tous' ||
        tutorial.level === level

      const matchesView =
        view === 'all' ||
        favorites.includes(String(tutorial.id))

      const tutorialStatus =
        tutorialProgress[String(tutorial.id)]?.status ?? 'À commencer'

      const matchesProgress =
        progressFilter === 'Tous' ||
        tutorialStatus === progressFilter

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLevel &&
        matchesView &&
        matchesProgress
      )
    })
  }, [
    search,
    category,
    level,
    view,
    favorites,
    progressFilter,
    tutorialProgress,
  ])

  return (
    <main className="min-h-screen bg-[#FFFAF6] dark:bg-[#211d2c]">
      {/* Hero */}
      <section className="bg-linear-to-br from-pink-100 via-[#FFF8F2] to-purple-100 dark:from-[#2f2438] dark:via-[#251f30] dark:to-[#2a2235]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-pink-600 shadow-sm dark:bg-[#2b2438] dark:text-pink-300">
            <Sparkles size={16} />
            Laisse parler ta créativité
          </span>

          <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-tight text-[#493747] sm:text-5xl dark:text-[#f7e8ef]">
            Trouve ta prochaine
            <span className="block text-pink-500 dark:text-pink-400">
              création préférée.
            </span>
          </h1>

          <p className="mt-4 max-w-xl leading-7 text-[#887985] dark:text-[#c4b5c2]">
            Des fleurs délicates aux petites figurines kawaii,
            découvre un projet et réalise-le à ton rythme.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        {/* Recherche et filtres */}
        <div className="rounded-3xl border border-pink-100 bg-white p-4 shadow-sm sm:p-6 dark:border-[#3d2f47] dark:bg-[#2b2438]">
          <label
            htmlFor="creation-search"
            className="mb-2 block text-sm font-semibold text-[#493747] dark:text-[#f7e8ef]"
          >
            Que souhaites-tu créer ?
          </label>

          <div className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-[#FFFAF6] px-4 dark:border-[#3d2f47] dark:bg-[#211d2c]">
            <Search size={20} className="shrink-0 text-pink-500 dark:text-pink-400" />

            <input
              id="creation-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une fleur, une figurine..."
              className="min-w-0 flex-1 bg-transparent py-4 text-sm text-[#493747] outline-none placeholder:text-[#B5A3AF] dark:text-[#f7e8ef] dark:placeholder:text-[#6d5d72]"
            />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="category-filter"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#493747] dark:text-[#f7e8ef]"
              >
                <SlidersHorizontal size={16} />
                Catégorie
              </label>

              <select
                id="category-filter"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-pink-100 bg-white px-4 py-3 text-sm outline-none focus:border-pink-400 dark:border-[#3d2f47] dark:bg-[#211d2c] dark:text-[#f7e8ef] dark:focus:border-pink-400"
              >
                <option value="Toutes">Toutes les catégories</option>

                {categories.map((item) => (
                  <option key={item.title} value={item.title}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="level-filter"
                className="mb-2 block text-sm font-semibold text-[#493747] dark:text-[#f7e8ef]"
              >
                Difficulté
              </label>

              <select
                id="level-filter"
                value={level}
                onChange={(event) => setLevel(event.target.value)}
                className="w-full rounded-xl border border-pink-100 bg-white px-4 py-3 text-sm outline-none focus:border-pink-400 dark:border-[#3d2f47] dark:bg-[#211d2c] dark:text-[#f7e8ef] dark:focus:border-pink-400"
              >
                <option value="Tous">Tous les niveaux</option>
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="progress-filter"
            className="mb-2 block text-sm font-semibold text-[#493747] dark:text-[#f7e8ef]"
          >
            Progression
          </label>

          <select
            id="progress-filter"
            value={progressFilter}
            onChange={(event) => setProgressFilter(event.target.value)}
            className="w-full rounded-xl border border-pink-100 bg-white px-4 py-3 text-sm outline-none focus:border-pink-400 dark:border-[#3d2f47] dark:bg-[#2b2438] dark:text-[#f7e8ef] dark:focus:border-pink-400"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="À commencer">À commencer</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
          </select>
        </div>

        {/* Navigation des créations */}
        <div className="mb-6 mt-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#493747] dark:text-[#f7e8ef]">
              {view === 'all'
                ? 'Toutes les créations'
                : 'Mes créations favorites'}
            </h2>

            <p className="mt-1 text-sm text-[#887985] dark:text-[#c4b5c2]">
              {filteredTutorials.length} tutoriel(s) trouvé(s)
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setView('all')}
              aria-pressed={view === 'all'}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                view === 'all'
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'border border-pink-100 bg-white text-[#887985] hover:bg-pink-50 dark:border-[#3d2f47] dark:bg-[#2b2438] dark:text-[#c4b5c2] dark:hover:bg-[#3a2f47]'
              }`}
            >
              Toutes
            </button>

            <button
              type="button"
              onClick={() => setView('favorites')}
              aria-pressed={view === 'favorites'}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                view === 'favorites'
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'border border-pink-100 bg-white text-[#887985] hover:bg-pink-50 dark:border-[#3d2f47] dark:bg-[#2b2438] dark:text-[#c4b5c2] dark:hover:bg-[#3a2f47]'
              }`}
            >
              <Heart
                size={16}
                fill={view === 'favorites' ? 'currentColor' : 'none'}
              />
              Mes favoris
              <span>({favoritesCount})</span>
            </button>
          </div>
        </div>

        {/* Galerie */}
        {filteredTutorials.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTutorials.map((tutorial) => (
              <TutorialCard
                key={tutorial.id}
                tutorial={tutorial}
                isFavorite={isFavorite(tutorial.id)}
                onToggleFavorite={() => toggleFavorite(tutorial.id)}
                progress={tutorialProgress[String(tutorial.id)]}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-pink-200 bg-white px-5 py-14 text-center dark:border-[#4a3a56] dark:bg-[#2b2438]">
            {view === 'favorites' ? (
              <Heart
                size={32}
                className="mx-auto text-pink-400"
              />
            ) : (
              <Sparkles
                size={32}
                className="mx-auto text-pink-400"
              />
            )}

            <h3 className="mt-4 text-lg font-bold text-[#493747] dark:text-[#f7e8ef]">
              {view === 'favorites'
                ? 'Aucun favori pour le moment'
                : 'Aucune création trouvée'}
            </h3>

            <p className="mt-2 text-sm text-[#887985] dark:text-[#c4b5c2]">
              {view === 'favorites'
                ? 'Explore les tutoriels et ajoute tes créations préférées avec le cœur.'
                : 'Essaie un autre mot ou modifie tes filtres.'}
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch('')
                setCategory('Toutes')
                setLevel('Tous')
                setView('all')
              }}
              className="mt-5 rounded-full bg-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-600"
            >
              Voir toutes les créations
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
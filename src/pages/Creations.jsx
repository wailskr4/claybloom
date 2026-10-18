
import { useMemo, useState } from 'react'
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Heart,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import useTutorialProgress from '../hooks/useTutorialProgress'
import useFavorites from '../hooks/useFavorites'

import { categories } from '../data/categories'
import { tutorials } from '../data/tutorials'
import TutorialCard from '../components/TutorialCard'

export default function Creations() {
  const { t } = useTranslation()

  // Filters
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [level, setLevel] = useState('all')
  const [view, setView] = useState('all')
  const [progressFilter, setProgressFilter] = useState('all')

  // Favorites
  const {
    favorites,
    favoritesCount,
    isFavorite,
    toggleFavorite,
  } = useFavorites()

  // Tutorial progress
  const { progress: tutorialProgress } =
    useTutorialProgress(tutorials)

  // Stable filter values, independent of the current language
  const levelKeys = {
    Débutant: 'beginner',
    Intermédiaire: 'intermediate',
    Avancé: 'advanced',
    beginner: 'beginner',
    intermediate: 'intermediate',
    advanced: 'advanced',
  }

  const statusKeys = {
    'À commencer': 'notStarted',
    'En cours': 'inProgress',
    Terminé: 'completed',
    notStarted: 'notStarted',
    inProgress: 'inProgress',
    completed: 'completed',
  }

  // Filter tutorials
  const filteredTutorials = useMemo(() => {
    const searchText = search.trim().toLocaleLowerCase()

    return tutorials.filter((tutorial) => {
      // Translated tutorial content
      const translated = tutorial.translationKey
        ? t(`tutorialData.${tutorial.translationKey}`, {
            returnObjects: true,
            defaultValue: {},
          })
        : {}

      const translatedTitle =
        typeof translated?.title === 'string'
          ? translated.title
          : tutorial.title

      const translatedDescription =
        typeof translated?.description === 'string'
          ? translated.description
          : tutorial.description || ''

      // Search in original and translated text
      const searchableText = [
        tutorial.title,
        translatedTitle,
        tutorial.description || '',
        translatedDescription,
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase()

      const matchesSearch =
        !searchText || searchableText.includes(searchText)

      // Category filtering using stable IDs
      const selectedCategory = categories.find(
        (item) => item.id === category
      )

const matchesCategory =
  category === 'all' ||
  tutorial.categoryId === category ||
  selectedCategory?.title === tutorial.category


      // Difficulty filtering
      const tutorialLevel =
        levelKeys[tutorial.level] ?? tutorial.level

      const matchesLevel =
        level === 'all' || tutorialLevel === level

      // Favorites filtering
      const favoriteIds = favorites.map(String)

      const matchesView =
        view === 'all' ||
        favoriteIds.includes(String(tutorial.id))

      // Progress filtering
      const tutorialStatus =
        tutorialProgress[String(tutorial.id)]?.status ??
        'À commencer'

      const normalizedStatus =
        statusKeys[tutorialStatus] ?? tutorialStatus

      const matchesProgress =
        progressFilter === 'all' ||
        normalizedStatus === progressFilter

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
    t,
  ])

  // Reset all filters
  function resetFilters() {
    setSearch('')
    setCategory('all')
    setLevel('all')
    setProgressFilter('all')
    setView('all')
  }

  return (
    <main className="min-h-screen bg-[#FFFAF6] dark:bg-[#211d2c]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-100 via-[#FFF8F2] to-purple-100 dark:from-[#2f2438] dark:via-[#251f30] dark:to-[#2a2235]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-pink-600 shadow-sm dark:bg-[#2b2438] dark:text-pink-300">
            <Sparkles size={16} />

            {t('creations.hero.badge')}
          </span>

          <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-tight text-[#493747] sm:text-5xl dark:text-[#f7e8ef]">
            {t('creations.hero.title')}

            <span className="block text-pink-500 dark:text-pink-400">
              {t('creations.hero.highlight')}
            </span>
          </h1>

          <p className="mt-4 max-w-xl leading-7 text-[#887985] dark:text-[#c4b5c2]">
            {t('creations.hero.description')}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        {/* Search and filters */}
        <div className="rounded-3xl border border-pink-100 bg-white p-4 shadow-sm sm:p-6 dark:border-[#3d2f47] dark:bg-[#2b2438]">
          {/* Search */}
          <label
            htmlFor="creation-search"
            className="mb-2 block text-sm font-semibold text-[#493747] dark:text-[#f7e8ef]"
          >
            {t('creations.search.label')}
          </label>

          <div className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-[#FFFAF6] px-4 dark:border-[#3d2f47] dark:bg-[#211d2c]">
            <Search
              size={20}
              className="shrink-0 text-pink-500 dark:text-pink-400"
            />

            <input
              id="creation-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('creations.search.placeholder')}
              className="min-w-0 flex-1 bg-transparent py-4 text-sm text-[#493747] outline-none placeholder:text-[#B5A3AF] dark:text-[#f7e8ef] dark:placeholder:text-[#6d5d72]"
            />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {/* Categories */}
            <div>
              <label
                htmlFor="category-filter"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#493747] dark:text-[#f7e8ef]"
              >
                <SlidersHorizontal size={16} />

                {t('creations.filters.category')}
              </label>

              <select
                id="category-filter"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="w-full rounded-xl border border-pink-100 bg-white px-4 py-3 text-sm outline-none focus:border-pink-400 dark:border-[#3d2f47] dark:bg-[#211d2c] dark:text-[#f7e8ef] dark:focus:border-pink-400"
              >
                <option value="all">
                  {t('creations.filters.allCategories')}
                </option>

                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {t(`categories.${item.id}`, {
                      defaultValue: item.title,
                    })}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label
                htmlFor="level-filter"
                className="mb-2 block text-sm font-semibold text-[#493747] dark:text-[#f7e8ef]"
              >
                {t('creations.filters.difficulty')}
              </label>

              <select
                id="level-filter"
                value={level}
                onChange={(event) =>
                  setLevel(event.target.value)
                }
                className="w-full rounded-xl border border-pink-100 bg-white px-4 py-3 text-sm outline-none focus:border-pink-400 dark:border-[#3d2f47] dark:bg-[#211d2c] dark:text-[#f7e8ef] dark:focus:border-pink-400"
              >
                <option value="all">
                  {t('creations.filters.allLevels')}
                </option>

                <option value="beginner">
                  {t('creations.levels.beginner')}
                </option>

                <option value="intermediate">
                  {t('creations.levels.intermediate')}
                </option>

                <option value="advanced">
                  {t('creations.levels.advanced')}
                </option>
              </select>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-5">
            <label
              htmlFor="progress-filter"
              className="mb-2 block text-sm font-semibold text-[#493747] dark:text-[#f7e8ef]"
            >
              {t('creations.filters.progress')}
            </label>

            <select
              id="progress-filter"
              value={progressFilter}
              onChange={(event) =>
                setProgressFilter(event.target.value)
              }
              className="w-full rounded-xl border border-pink-100 bg-white px-4 py-3 text-sm outline-none focus:border-pink-400 dark:border-[#3d2f47] dark:bg-[#211d2c] dark:text-[#f7e8ef] dark:focus:border-pink-400"
            >
              <option value="all">
                {t('creations.filters.allStatuses')}
              </option>

              <option value="notStarted">
                {t('creations.progress.notStarted')}
              </option>

              <option value="inProgress">
                {t('creations.progress.inProgress')}
              </option>

              <option value="completed">
                {t('creations.progress.completed')}
              </option>
            </select>
          </div>
        </div>

        {/* Results heading and tabs */}
        <div className="mb-6 mt-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#493747] dark:text-[#f7e8ef]">
              {view === 'all'
                ? t('creations.results.all')
                : t('creations.results.favorites')}
            </h2>

            <p className="mt-1 text-sm text-[#887985] dark:text-[#c4b5c2]">
              {t('creations.results.count', {
                count: filteredTutorials.length,
              })}
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
              {t('creations.tabs.all')}
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
                fill={
                  view === 'favorites'
                    ? 'currentColor'
                    : 'none'
                }
              />

              {t('creations.tabs.favorites')}

              <span>({favoritesCount})</span>
            </button>
          </div>
        </div>

        {/* Tutorial gallery */}
        {filteredTutorials.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTutorials.map((tutorial) => (
              <TutorialCard
                key={tutorial.id}
                tutorial={tutorial}
                isFavorite={isFavorite(tutorial.id)}
                onToggleFavorite={() =>
                  toggleFavorite(tutorial.id)
                }
                progress={
                  tutorialProgress[String(tutorial.id)]
                }
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
                ? t('creations.empty.noFavorites')
                : t('creations.empty.noResults')}
            </h3>

            <p className="mt-2 text-sm text-[#887985] dark:text-[#c4b5c2]">
              {view === 'favorites'
                ? t('creations.empty.favoritesDescription')
                : t('creations.empty.resultsDescription')}
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-full bg-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-600"
            >
              {t('creations.empty.reset')}
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

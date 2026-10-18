
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Flower2,
  Play,
  Search,
  Sparkles,
  Trophy,
} from 'lucide-react'

import { tutorials } from '../data/tutorials'

const STORAGE_PREFIX = 'claybloom:tutorial:'

const LEVEL_KEYS = {
  Débutant: 'beginner',
  Intermédiaire: 'intermediate',
  Avancé: 'advanced',
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
}

function readStorage(key, fallback = []) {
  try {
    const value = localStorage.getItem(key)
    const parsed = value ? JSON.parse(value) : fallback

    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

/**
 * Récupère les traductions du tutoriel.
 * La structure attendue est :
 * tutorialData -> translationKey -> title, description, category...
 */
function getTranslatedTutorial(tutorial, i18n) {
  if (!tutorial.translationKey) return tutorial

  const languages = [
    i18n.resolvedLanguage,
    i18n.language,
    i18n.resolvedLanguage?.split('-')[0],
    i18n.language?.split('-')[0],
  ].filter(Boolean)

  for (const language of [...new Set(languages)]) {
    const translated = i18n.getResourceBundle(
      language,
      'translation'
    )?.tutorialData?.[tutorial.translationKey]

    if (
      translated &&
      typeof translated === 'object' &&
      !Array.isArray(translated)
    ) {
      return {
        ...tutorial,
        ...translated,
        id: tutorial.id,
        translationKey: tutorial.translationKey,
      }
    }
  }

  return tutorial
}

/**
 * Utilise des statuts stables pour le calcul.
 * Les libellés affichés sont traduits séparément.
 */
function getProgress(tutorial) {
  const id = String(tutorial.id)
  const instructions = tutorial.instructions ?? []
  const total = instructions.length

  const savedSteps = readStorage(
    `${STORAGE_PREFIX}${id}:steps`
  )

  const completedSteps = new Set(
    savedSteps.filter(
      (index) =>
        Number.isInteger(index) &&
        index >= 0 &&
        index < total
    )
  )

  const completed = completedSteps.size
  const percentage = total
    ? Math.round((completed / total) * 100)
    : 0

  let status = 'notStarted'

  if (total > 0 && completed === total) {
    status = 'completed'
  } else if (completed > 0) {
    status = 'inProgress'
  }

  return {
    completed,
    total,
    percentage,
    status,
  }
}

function TutorialCard({ tutorial, progress }) {
  const { t } = useTranslation()
  const [imageFailed, setImageFailed] = useState(false)

  const levelKey =
    LEVEL_KEYS[tutorial.level] || tutorial.level

  const translatedLevel = t(
    `tutorials.levels.${levelKey}`,
    {
      defaultValue: t(`creations.levels.${levelKey}`, {
        defaultValue: tutorial.level || '',
      }),
    }
  )

  const translatedStatus = t(
    `tutorials.status${progress.status.charAt(0).toUpperCase()}${progress.status.slice(1)}`,
    {
      defaultValue: t(
        `creations.progress.${progress.status}`,
        { defaultValue: progress.status }
      ),
    }
  )

  const isCompleted = progress.status === 'completed'
  const isStarted = progress.status === 'inProgress'

  return (
    <article
      aria-label={`${tutorial.title}: ${translatedStatus}`}
      className="group overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-100/60 dark:border-[#49364b] dark:bg-[#241e2a] dark:hover:shadow-purple-950/30"
    >
      <Link
        to={`/tutoriels/${tutorial.id}`}
        className="block"
        aria-label={t('tutorials.openTutorial', {
          title: tutorial.title,
          defaultValue: `Open tutorial ${tutorial.title}`,
        })}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-amber-50 dark:from-[#2f2438] dark:via-[#251f30] dark:to-[#2a2235]">
          {!imageFailed && tutorial.image ? (
            <img
              src={tutorial.image}
              alt={tutorial.title}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-pink-400 dark:text-pink-300">
              <Flower2 size={48} />
              <span className="text-xs font-medium">
                {t('tutorials.cardSweetImage')}
              </span>
            </div>
          )}

          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-pink-600 shadow-sm dark:bg-[#2b2438]/95 dark:text-pink-300">
            {translatedLevel}
          </span>

          {isCompleted && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm dark:bg-[#2b2438] dark:text-green-400">
              <CheckCircle2 size={14} />
              {t('tutorials.statusCompleted', {
                defaultValue: t('creations.progress.completed'),
              })}
            </span>
          )}
        </div>
      </Link>

      <div className="p-5">
        {tutorial.category && (
          <p className="text-xs font-semibold text-pink-500 dark:text-pink-400">
            {tutorial.category}
          </p>
        )}

        <h3 className="mt-2 text-lg font-extrabold leading-snug text-[#493747] dark:text-[#f7e8ef]">
          {tutorial.title}
        </h3>

        {tutorial.description && (
          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#806C7A] dark:text-[#c4b5c2]">
            {tutorial.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-[#998590] dark:text-[#c4b5c2]">
          {tutorial.duration && (
            <span className="flex items-center gap-1">
              <Clock3 size={14} />
              {tutorial.duration}
            </span>
          )}

          <span className="flex items-center gap-1">
            <BookOpen size={14} />
            {t('tutorials.stepsCount', {
              count: progress.total,
              defaultValue: `${progress.total} steps`,
            })}
          </span>
        </div>

        {progress.total > 0 && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-2 text-xs">
              <span className="text-[#806C7A] dark:text-[#c4b5c2]">
                {isCompleted
                  ? t('tutorials.progressCompleted')
                  : isStarted
                    ? t('tutorials.stepsProgress', {
                        completed: progress.completed,
                        total: progress.total,
                        defaultValue: `${progress.completed}/${progress.total} steps`,
                      })
                    : t('tutorials.progressNotStarted')}
              </span>

              <span className="font-bold text-pink-600 dark:text-pink-400">
                {progress.percentage}%
              </span>
            </div>

            <div
              className="h-2 overflow-hidden rounded-full bg-pink-100 dark:bg-[#3a2f47]"
              role="progressbar"
              aria-label={t('tutorials.progressAria', {
                title: tutorial.title,
                defaultValue: `Progress for ${tutorial.title}`,
              })}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress.percentage}
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isCompleted ? 'bg-green-500' : 'bg-pink-500'
                }`}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}

        <Link
          to={`/tutoriels/${tutorial.id}`}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-pink-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-pink-600"
        >
          {isCompleted
            ? t('tutorials.btnReview')
            : isStarted
              ? t('tutorials.btnResume')
              : t('tutorials.btnStart')}
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  )
}

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-sm font-bold text-pink-600 dark:text-pink-400">
        <Icon size={18} />
        {eyebrow}
      </div>

      <h2 className="mt-2 text-2xl font-extrabold text-[#493747] sm:text-3xl dark:text-[#f7e8ef]">
        {title}
      </h2>

      {description && (
        <p className="mt-2 text-sm leading-6 text-[#806C7A] dark:text-[#c4b5c2]">
          {description}
        </p>
      )}
    </div>
  )
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-3xl border border-dashed border-pink-200 bg-white/70 px-6 py-10 text-center dark:border-[#4a3a56] dark:bg-[#2b2438]/70">
      <Flower2
        size={35}
        className="mx-auto text-pink-300 dark:text-pink-400/70"
      />

      <h3 className="mt-3 font-bold text-[#493747] dark:text-[#f7e8ef]">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#806C7A] dark:text-[#c4b5c2]">
        {description}
      </p>
    </div>
  )
}

export default function Tutoriels() {
  const { t, i18n } = useTranslation()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [level, setLevel] = useState('all')

  // Préparer les tutoriels traduits et leur progression.
  const learningData = tutorials.map((originalTutorial) => {
    const tutorial = getTranslatedTutorial(
      originalTutorial,
      i18n
    )

    return {
      tutorial,
      originalTutorial,
      progress: getProgress(originalTutorial),
    }
  })

  // Catégories avec identifiants stables.
  const categoryOptions = useMemo(() => {
    const map = new Map()

    tutorials.forEach((tutorial) => {
      const id =
        tutorial.categoryId ||
        tutorial.category ||
        'other'

      if (!map.has(id)) {
        map.set(id, {
          id,
          title: tutorial.category || id,
        })
      }
    })

    return [...map.values()]
  }, [])

  // Niveaux normalisés pour conserver des filtres cohérents.
  const levelOptions = [
    { id: 'beginner', label: 'beginner' },
    { id: 'intermediate', label: 'intermediate' },
    { id: 'advanced', label: 'advanced' },
  ]

  const beginners = learningData.filter(
    ({ originalTutorial, progress }) => {
      const levelKey =
        LEVEL_KEYS[originalTutorial.level] ||
        originalTutorial.level

      return (
        levelKey === 'beginner' &&
        progress.status === 'notStarted'
      )
    }
  )

  const inProgress = learningData.filter(
    ({ progress }) => progress.status === 'inProgress'
  )

  const completed = learningData.filter(
    ({ progress }) => progress.status === 'completed'
  )

  const filteredTutorials = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()

    return learningData.filter(
      ({ tutorial, originalTutorial }) => {
        const categoryId =
          originalTutorial.categoryId ||
          originalTutorial.category ||
          'other'

        const levelKey =
          LEVEL_KEYS[originalTutorial.level] ||
          originalTutorial.level

        const searchableText = [
          originalTutorial.title,
          originalTutorial.description,
          originalTutorial.category,
          tutorial.title,
          tutorial.description,
          tutorial.category,
        ]
          .filter(Boolean)
          .join(' ')
          .toLocaleLowerCase()

        const matchesSearch =
          !query || searchableText.includes(query)

        const matchesCategory =
          category === 'all' || categoryId === category

        const matchesLevel =
          level === 'all' || levelKey === level

        return (
          matchesSearch &&
          matchesCategory &&
          matchesLevel
        )
      }
    )
  }, [learningData, search, category, level])

  const totalCompletedSteps = learningData.reduce(
    (sum, item) => sum + item.progress.completed,
    0
  )

  const totalSteps = learningData.reduce(
    (sum, item) => sum + item.progress.total,
    0
  )

  const overallProgress = totalSteps
    ? Math.round((totalCompletedSteps / totalSteps) * 100)
    : 0

  function resetFilters() {
    setSearch('')
    setCategory('all')
    setLevel('all')
  }

  return (
    <main className="min-h-screen bg-[#FFF8F2] text-[#493747] dark:bg-[#211d2c] dark:text-[#f7e8ef]">
      <section className="overflow-hidden border-b border-pink-100 bg-gradient-to-br from-pink-100 via-[#FFF5F8] to-purple-100 dark:border-[#3d2f47] dark:from-[#2f2438] dark:via-[#251f30] dark:to-[#2a2235]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 px-4 py-2 text-sm font-bold text-pink-600 dark:border-[#4a3a56] dark:bg-[#2b2438]/80 dark:text-pink-300">
              <Sparkles size={16} />
              {t('tutorials.badge')}
            </span>

            <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              {t('tutorials.title')}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#806C7A] dark:text-[#c4b5c2]">
              {t('tutorials.description')}
            </p>

            <a
              href="#explorer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-pink-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-pink-600 dark:shadow-none"
            >
              {t('tutorials.exploreButton')}
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-sm dark:border-[#3d2f47] dark:bg-[#2b2438]/80">
              <BookOpen
                size={24}
                className="text-pink-500 dark:text-pink-400"
              />
              <p className="mt-4 text-3xl font-extrabold">
                {tutorials.length}
              </p>
              <p className="mt-1 text-sm text-[#806C7A] dark:text-[#c4b5c2]">
                {t('tutorials.availableCount')}
              </p>
            </div>

            <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-sm dark:border-[#3d2f47] dark:bg-[#2b2438]/80">
              <Trophy
                size={24}
                className="text-amber-500 dark:text-amber-400"
              />
              <p className="mt-4 text-3xl font-extrabold">
                {completed.length}
              </p>
              <p className="mt-1 text-sm text-[#806C7A] dark:text-[#c4b5c2]">
                {t('tutorials.completedCount')}
              </p>
            </div>

            <div className="col-span-2 rounded-3xl border border-white bg-white/80 p-5 shadow-sm dark:border-[#3d2f47] dark:bg-[#2b2438]/80">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold">
                    {t('tutorials.globalProgressTitle')}
                  </p>
                  <p className="mt-1 text-xs text-[#806C7A] dark:text-[#c4b5c2]">
                    {t('tutorials.globalProgressDesc')}
                  </p>
                </div>

                <span className="text-2xl font-extrabold text-pink-600 dark:text-pink-400">
                  {overallProgress}%
                </span>
              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-pink-100 dark:bg-[#3a2f47]">
                <div
                  className="h-full rounded-full bg-pink-500 transition-all"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-5 py-10 sm:px-8 sm:py-14">
        {/* Pour débuter */}
        <section>
          <SectionHeading
            icon={Flower2}
            eyebrow={t('tutorials.beginnersEyebrow')}
            title={t('tutorials.beginnersTitle')}
            description={t('tutorials.beginnersDesc')}
          />

          {beginners.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {beginners.slice(0, 3).map(({ tutorial, progress }) => (
                <TutorialCard
                  key={tutorial.id}
                  tutorial={tutorial}
                  progress={progress}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t('tutorials.beginnersEmptyTitle')}
              description={t('tutorials.beginnersEmptyDesc')}
            />
          )}
        </section>

        {/* Continuer */}
        <section>
          <SectionHeading
            icon={Play}
            eyebrow={t('tutorials.inProgressEyebrow')}
            title={t('tutorials.inProgressTitle')}
            description={t('tutorials.inProgressDesc')}
          />

          {inProgress.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {inProgress.map(({ tutorial, progress }) => (
                <TutorialCard
                  key={tutorial.id}
                  tutorial={tutorial}
                  progress={progress}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t('tutorials.inProgressEmptyTitle')}
              description={t('tutorials.inProgressEmptyDesc')}
            />
          )}
        </section>

        {/* Terminés */}
        <section>
          <SectionHeading
            icon={CheckCircle2}
            eyebrow={t('tutorials.completedEyebrow')}
            title={t('tutorials.completedTitle')}
            description={t('tutorials.completedDesc')}
          />

          {completed.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {completed.map(({ tutorial, progress }) => (
                <TutorialCard
                  key={tutorial.id}
                  tutorial={tutorial}
                  progress={progress}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t('tutorials.completedEmptyTitle')}
              description={t('tutorials.completedEmptyDesc')}
            />
          )}
        </section>

        {/* Explorer */}
        <section id="explorer" className="scroll-mt-8">
          <SectionHeading
            icon={BookOpen}
            eyebrow={t('tutorials.exploreEyebrow')}
            title={t('tutorials.exploreAllTitle')}
            description={t('tutorials.exploreAllDesc')}
          />

          <div className="rounded-3xl border border-pink-100 bg-white p-4 shadow-sm sm:p-5 dark:border-[#3d2f47] dark:bg-[#2b2438]">
            <label className="relative block">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#998590] dark:text-[#6d5d72]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('tutorials.searchPlaceholder')}
                className="w-full rounded-2xl border border-pink-100 bg-[#FFFCFA] py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-[#B4A2AC] focus:border-pink-300 focus:ring-2 focus:ring-pink-100 dark:border-[#3d2f47] dark:bg-[#211d2c] dark:text-[#f7e8ef] dark:placeholder:text-[#6d5d72] dark:focus:border-pink-400 dark:focus:ring-pink-500/20"
              />
            </label>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-semibold text-[#806C7A] dark:text-[#c4b5c2]">
                {t('tutorials.categoryLabel')}

                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-pink-100 bg-white px-3 py-3 text-sm font-normal outline-none focus:border-pink-300 dark:border-[#3d2f47] dark:bg-[#211d2c] dark:text-[#f7e8ef] dark:focus:border-pink-400"
                >
                  <option value="all">
                    {t('tutorials.allCategories')}
                  </option>

                  {categoryOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {t(`categories.${item.id}`, {
                        defaultValue: item.title,
                      })}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-semibold text-[#806C7A] dark:text-[#c4b5c2]">
                {t('tutorials.levelLabel')}

                <select
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-pink-100 bg-white px-3 py-3 text-sm font-normal outline-none focus:border-pink-300 dark:border-[#3d2f47] dark:bg-[#211d2c] dark:text-[#f7e8ef] dark:focus:border-pink-400"
                >
                  <option value="all">
                    {t('tutorials.allLevels')}
                  </option>

                  {levelOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {t(`creations.levels.${item.id}`, {
                        defaultValue: t(
                          `tutorials.levels.${item.id}`,
                          { defaultValue: item.label }
                        ),
                      })}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#806C7A] dark:text-[#c4b5c2]">
                <strong>{filteredTutorials.length}</strong>{' '}
                {t('tutorials.foundCount')}
              </p>

              {(search || category !== 'all' || level !== 'all') && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm font-bold text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
                >
                  {t('tutorials.resetFilters')}
                </button>
              )}
            </div>
          </div>

          {filteredTutorials.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTutorials.map(({ tutorial, progress }) => (
                <TutorialCard
                  key={tutorial.id}
                  tutorial={tutorial}
                  progress={progress}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState
                title={t('tutorials.noResultTitle')}
                description={t('tutorials.noResultDesc')}
              />
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

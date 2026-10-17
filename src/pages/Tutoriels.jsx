
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
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

function readStorage(key, fallback = []) {
  try {
    const value = localStorage.getItem(key)
    const parsed = value ? JSON.parse(value) : fallback
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

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

  let status = 'À commencer'

  if (total > 0 && completed === total) {
    status = 'Terminé'
  } else if (completed > 0) {
    status = 'En cours'
  }

  return {
    completed,
    total,
    percentage,
    status,
  }
}

function TutorialCard({ tutorial, progress }) {
  const [imageFailed, setImageFailed] = useState(false)

  const isCompleted = progress.status === 'Terminé'
  const isStarted = progress.status === 'En cours'

  return (
    <article className="group overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-100/60">
      <Link
        to={`/tutoriels/${tutorial.id}`}
        className="block"
        aria-label={`Ouvrir le tutoriel ${tutorial.title}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-amber-50">
          {!imageFailed && tutorial.image ? (
            <img
              src={tutorial.image}
              alt={tutorial.title}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-pink-400">
              <Flower2 size={48} />
              <span className="text-xs font-medium">
                Une création pleine de douceur
              </span>
            </div>
          )}

          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-pink-600 shadow-sm">
            {tutorial.level}
          </span>

          {isCompleted && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm">
              <CheckCircle2 size={14} />
              Terminé
            </span>
          )}
        </div>
      </Link>

      <div className="p-5">
        <p className="text-xs font-semibold text-pink-500">
          {tutorial.category}
        </p>

        <h3 className="mt-2 text-lg font-extrabold leading-snug text-[#493747]">
          {tutorial.title}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#806C7A]">
          {tutorial.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-[#998590]">
          <span className="flex items-center gap-1">
            <Clock3 size={14} />
            {tutorial.duration}
          </span>

          <span className="flex items-center gap-1">
            <BookOpen size={14} />
            {progress.total} étapes
          </span>
        </div>

        {progress.total > 0 && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-[#806C7A]">
                {isCompleted
                  ? 'Tutoriel terminé'
                  : isStarted
                    ? `${progress.completed}/${progress.total} étapes`
                    : 'Prêt à commencer'}
              </span>

              <span className="font-bold text-pink-600">
                {progress.percentage}%
              </span>
            </div>

            <div
              className="h-2 overflow-hidden rounded-full bg-pink-100"
              role="progressbar"
              aria-label={`Progression de ${tutorial.title}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress.percentage}
            >
              <div
                className="h-full rounded-full bg-pink-500 transition-all duration-300"
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
            ? 'Revoir le tutoriel'
            : isStarted
              ? 'Reprendre'
              : 'Commencer'}
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  )
}

function SectionHeading({ icon: Icon, eyebrow, title, description }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-sm font-bold text-pink-600">
        <Icon size={18} />
        {eyebrow}
      </div>

      <h2 className="mt-2 text-2xl font-extrabold text-[#493747] sm:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="mt-2 text-sm leading-6 text-[#806C7A]">
          {description}
        </p>
      )}
    </div>
  )
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-3xl border border-dashed border-pink-200 bg-white/70 px-6 py-10 text-center">
      <Flower2 size={35} className="mx-auto text-pink-300" />

      <h3 className="mt-3 font-bold text-[#493747]">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#806C7A]">
        {description}
      </p>
    </div>
  )
}

export default function Tutoriels() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Toutes')
  const [level, setLevel] = useState('Tous')

  // Les données sont relues à l'ouverture de cette page.
  const learningData = useMemo(() => {
    return tutorials.map((tutorial) => ({
      tutorial,
      progress: getProgress(tutorial),
    }))
  }, [])

  const beginners = learningData.filter(
    ({ tutorial, progress }) =>
      tutorial.level === 'Débutant' &&
      progress.status === 'À commencer'
  )

  const inProgress = learningData.filter(
    ({ progress }) => progress.status === 'En cours'
  )

  const completed = learningData.filter(
    ({ progress }) => progress.status === 'Terminé'
  )

  const categories = [
    ...new Set(tutorials.map((tutorial) => tutorial.category)),
  ]

  const levels = [
    ...new Set(tutorials.map((tutorial) => tutorial.level)),
  ]

  const filteredTutorials = learningData.filter(
    ({ tutorial }) => {
      const query = search.trim().toLowerCase()

      const matchesSearch =
        !query ||
        tutorial.title.toLowerCase().includes(query) ||
        tutorial.description?.toLowerCase().includes(query) ||
        tutorial.category.toLowerCase().includes(query)

      const matchesCategory =
        category === 'Toutes' ||
        tutorial.category === category

      const matchesLevel =
        level === 'Tous' ||
        tutorial.level === level

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLevel
      )
    }
  )

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

  return (
    <main className="min-h-screen bg-[#FFF8F2] text-[#493747]">
      {/* En-tête de l'espace d'apprentissage */}
      <section className="overflow-hidden border-b border-pink-100 bg-gradient-to-br from-pink-100 via-[#FFF5F8] to-purple-100">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 px-4 py-2 text-sm font-bold text-pink-600">
              <Sparkles size={16} />
              Mon atelier créatif
            </span>

            <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Chaque création commence par un petit geste.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#806C7A]">
              Apprends à ton rythme grâce à des tutoriels
              illustrés, suis tes progrès et transforme
              tes idées en jolies créations.
            </p>

            <a
              href="#explorer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-pink-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-pink-600"
            >
              Explorer les tutoriels
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-sm">
              <BookOpen size={24} className="text-pink-500" />
              <p className="mt-4 text-3xl font-extrabold">
                {tutorials.length}
              </p>
              <p className="mt-1 text-sm text-[#806C7A]">
                Tutoriels disponibles
              </p>
            </div>

            <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-sm">
              <Trophy size={24} className="text-amber-500" />
              <p className="mt-4 text-3xl font-extrabold">
                {completed.length}
              </p>
              <p className="mt-1 text-sm text-[#806C7A]">
                Tutoriels terminés
              </p>
            </div>

            <div className="col-span-2 rounded-3xl border border-white bg-white/80 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold">Ma progression globale</p>
                  <p className="mt-1 text-xs text-[#806C7A]">
                    Étapes réalisées sur l'ensemble des guides
                  </p>
                </div>

                <span className="text-2xl font-extrabold text-pink-600">
                  {overallProgress}%
                </span>
              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-pink-100">
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
            eyebrow="Tes premiers pas"
            title="Pour débuter"
            description="Commence par des projets accessibles et découvre le plaisir du modelage."
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
              title="Tu as découvert tous les projets débutants !"
              description="Explore les autres tutoriels pour découvrir de nouvelles techniques."
            />
          )}
        </section>

        {/* Continuer */}
        <section>
          <SectionHeading
            icon={Play}
            eyebrow="Reprends là où tu en étais"
            title="Continuer mes tutoriels"
            description="Tes projets en cours sont ici. Ta progression est conservée sur cet appareil."
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
              title="Ton prochain projet t'attend"
              description="Commence un tutoriel et coche ses étapes au fur et à mesure. Tu le retrouveras ici."
            />
          )}
        </section>

        {/* Terminés */}
        <section>
          <SectionHeading
            icon={CheckCircle2}
            eyebrow="Tes réussites"
            title="Tutoriels terminés"
            description="Retrouve les guides que tu as entièrement réalisés."
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
              title="Ta première réussite est à venir"
              description="Lorsque tu auras coché toutes les étapes d'un tutoriel, il apparaîtra ici."
            />
          )}
        </section>

        {/* Explorer */}
        <section id="explorer" className="scroll-mt-8">
          <SectionHeading
            icon={BookOpen}
            eyebrow="À toi de choisir"
            title="Explorer tous les tutoriels"
            description="Recherche une création ou choisis une catégorie et un niveau qui te correspondent."
          />

          <div className="rounded-3xl border border-pink-100 bg-white p-4 shadow-sm sm:p-5">
            <label className="relative block">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#998590]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher une création..."
                className="w-full rounded-2xl border border-pink-100 bg-[#FFFCFA] py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-[#B4A2AC] focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
              />
            </label>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-semibold text-[#806C7A]">
                Catégorie
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-pink-100 bg-white px-3 py-3 text-sm font-normal outline-none focus:border-pink-300"
                >
                  <option value="Toutes">Toutes les catégories</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-semibold text-[#806C7A]">
                Niveau
                <select
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-pink-100 bg-white px-3 py-3 text-sm font-normal outline-none focus:border-pink-300"
                >
                  <option value="Tous">Tous les niveaux</option>
                  {levels.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#806C7A]">
                <strong>{filteredTutorials.length}</strong>{' '}
                tutoriel(s) trouvé(s)
              </p>

              {(search || category !== 'Toutes' || level !== 'Tous') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setCategory('Toutes')
                    setLevel('Tous')
                  }}
                  className="text-sm font-bold text-pink-600 hover:text-pink-700"
                >
                  Réinitialiser les filtres
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
                title="Aucun tutoriel trouvé"
                description="Essaie un autre mot-clé ou modifie tes filtres."
              />
            </div>
          )}
        </section>
      </div>

      <footer className="border-t border-pink-100 bg-white px-5 py-8 text-center text-sm text-[#998590]">
        Chaque étape est une petite victoire 🌸 — ClayBloom
      </footer>
    </main>
  )
}

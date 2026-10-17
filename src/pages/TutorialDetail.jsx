
import { useEffect, useState } from 'react'
import useFavorites from '../hooks/useFavorites'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Heart,
  Lightbulb,
  Palette,
  RotateCcw,
  Sparkles,
  TriangleAlert,
} from 'lucide-react'
import { tutorials } from '../data/tutorials'

const STORAGE_PREFIX = 'claybloom:tutorial:'

function readStorage(key, fallback = []) {
  if (typeof window === 'undefined') return fallback

  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function cureLabel(cure) {
  if (!cure) return ''

  if (cure.type === 'polymer') {
    return 'Pâte polymère : cuisson nécessaire'
  }

  if (cure.type === 'air-dry') {
    return 'Pâte autodurcissante : séchage à l’air libre'
  }

  return 'Séchage ou finition'
}

function InfoSection({ title, icon: Icon, items, color = 'pink' }) {
  if (!items?.length) return null

  const styles = {
    pink: 'border-pink-100 bg-pink-50/70 text-pink-700',
    amber: 'border-amber-100 bg-amber-50/80 text-amber-800',
    purple: 'border-purple-100 bg-purple-50/80 text-purple-700',
  }

  return (
    <section className="rounded-3xl border border-[#F3E8EE] bg-white p-5 shadow-sm sm:p-7">
      <div className="flex items-center gap-3">
        <span className={`rounded-xl border p-2.5 ${styles[color]}`}>
          <Icon size={21} />
        </span>

        <h2 className="text-xl font-extrabold">{title}</h2>
      </div>

      <ul className="mt-5 space-y-3">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex items-start gap-3 text-sm leading-6 text-[#806C7A]"
          >
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-pink-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function TutorialDetail() {
  const { id } = useParams()


const {
  isFavorite,
  toggleFavorite,
} = useFavorites()

const favorite = isFavorite(id)


  const tutorial = tutorials.find(
    (item) => String(item.id) === id
  )

  const progressKey = `${STORAGE_PREFIX}${id}:steps`
  const materialsKey = `${STORAGE_PREFIX}${id}:materials`

  const [completedSteps, setCompletedSteps] = useState(
    () => readStorage(progressKey)
  )
  const [checkedMaterials, setCheckedMaterials] = useState(
    () => readStorage(materialsKey)
  )
  const [imageFailed, setImageFailed] = useState(false)

  // Recharger les données lorsque l'identifiant du tutoriel change.
  useEffect(() => {
    setCompletedSteps(readStorage(progressKey))
    setCheckedMaterials(readStorage(materialsKey))
    setImageFailed(false)
  }, [progressKey, materialsKey])

  // Sauvegarder automatiquement les étapes cochées.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        progressKey,
        JSON.stringify(completedSteps)
      )
    } catch {
      // Le tutoriel reste utilisable si le stockage est indisponible.
    }
  }, [progressKey, completedSteps])

  // Sauvegarder automatiquement le matériel préparé.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        materialsKey,
        JSON.stringify(checkedMaterials)
      )
    } catch {
      // Le tutoriel reste utilisable si le stockage est indisponible.
    }
  }, [materialsKey, checkedMaterials])

  if (!tutorial) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#FFF8F2] px-6 text-center text-[#493747]">
        <span className="mb-4 text-5xl">🌷</span>

        <h1 className="text-2xl font-bold">
          Tutoriel introuvable
        </h1>

        <p className="mt-3 text-[#998590]">
          Ce guide n'existe pas ou n'est plus disponible.
        </p>

        <Link
          to="/creations"
          className="mt-6 rounded-full bg-pink-500 px-6 py-3 font-semibold text-white transition hover:bg-pink-600"
        >
          Retour aux créations
        </Link>
      </main>
    )
  }

  const instructions = tutorial.instructions ?? []
  const materials = tutorial.materials ?? []
  const palette = tutorial.palette ?? []
  const tips = tutorial.tips ?? []
  const mistakes = tutorial.commonMistakes ?? []
  const variations = tutorial.variations ?? []
  const tags = tutorial.tags ?? []
  const cure = tutorial.cure

  const validCompletedSteps = completedSteps.filter(
    (index) => Number.isInteger(index) && index >= 0 && index < instructions.length
  )

  const validCheckedMaterials = checkedMaterials.filter(
    (index) => Number.isInteger(index) && index >= 0 && index < materials.length
  )

  const progress = instructions.length
    ? Math.round(
        (validCompletedSteps.length / instructions.length) * 100
      )
    : 0

  function toggleStep(index) {
    setCompletedSteps((previous) =>
      previous.includes(index)
        ? previous.filter((step) => step !== index)
        : [...previous, index]
    )
  }

  function toggleMaterial(index) {
    setCheckedMaterials((previous) =>
      previous.includes(index)
        ? previous.filter((item) => item !== index)
        : [...previous, index]
    )
  }

  function resetProgress() {
    setCompletedSteps([])
    setCheckedMaterials([])
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2] text-[#493747]">
      {/* Navigation */}
      <header className="border-b border-pink-100 bg-white/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-pink-600"
          >
            <Sparkles size={23} />
            ClayBloom
          </Link>

          <Link
            to="/creations"
            className="flex items-center gap-2 text-sm font-semibold text-[#806C7A] transition hover:text-pink-600"
          >
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">
              Toutes les créations
            </span>
            <span className="sm:hidden">Retour</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        {/* Fil d'Ariane */}
        <nav
          aria-label="Fil d’Ariane"
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#998590]"
        >
          <Link to="/" className="hover:text-pink-600">
            Accueil
          </Link>
          <span>/</span>
          <Link to="/creations" className="hover:text-pink-600">
            Créations
          </Link>
          <span>/</span>
          <span className="font-medium text-pink-600">
            {tutorial.title}
          </span>
        </nav>

        {/* Présentation */}
        <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative flex min-h-72 items-center justify-center overflow-hidden rounded-4xl bg-linear-to-br from-pink-100 via-purple-100 to-amber-50 shadow-lg shadow-pink-100/60 sm:min-h-107.5">
            {!imageFailed && tutorial.image ? (
              <img
                src={tutorial.image}
                alt={tutorial.title}
                onError={() => setImageFailed(true)}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center px-8 py-12 text-center">
                <span className="text-7xl" aria-hidden="true">
                  🌸
                </span>
                <p className="mt-4 max-w-xs text-sm font-medium text-[#806C7A]">
                  Une création pleine de douceur
                </p>
                <span className="mt-2 text-xs text-[#998590]">
                  {tutorial.category}
                </span>
              </div>
            )}

            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-pink-600 shadow-sm">
              {tutorial.level}
            </span>
          </div>

          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700">
              <Sparkles size={15} />
              {tutorial.category}
            </span>

            <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-5xl">
              {tutorial.title}
            </h1>

            <p className="mt-5 text-base leading-7 text-[#806C7A]">
              {tutorial.description ||
                'Découvre ce tutoriel créatif et avance étape par étape pour réaliser ta propre création.'}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
                <Sparkles size={16} className="text-pink-500" />
                {tutorial.level}
              </span>

              <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
                <Clock3 size={16} className="text-pink-500" />
                {tutorial.duration}
              </span>

              <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
                <BookOpen size={16} className="text-pink-500" />
                {instructions.length} étapes
              </span>
            </div>

            {tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-pink-100 bg-white/80 px-3 py-1.5 text-xs font-medium text-[#806C7A]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <a
              href="#etapes"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-pink-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-pink-600"
            >
              Commencer le tutoriel
              <ArrowRight size={18} />
            </a>
          </div>
        </section>
<button
  type="button"
  onClick={() => toggleFavorite(id)}
  aria-pressed={favorite}
  className={`mt-4 inline-flex items-center gap-2 rounded-full border px-6 py-3.5 font-bold transition hover:-translate-y-0.5 ${
    favorite
      ? 'border-pink-500 bg-pink-50 text-pink-600'
      : 'border-pink-200 bg-white text-[#806C7A] hover:border-pink-400 hover:text-pink-600'
  }`}
>
  <Heart
    size={18}
    fill={favorite ? 'currentColor' : 'none'}
  />

  {favorite
    ? 'Retirer des favoris'
    : 'Ajouter aux favoris'}
</button>
        {/* Palette de couleurs */}
        {palette.length > 0 && (
          <section className="mt-10 rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <Palette size={22} />
              </span>

              <div>
                <h2 className="text-xl font-extrabold">
                  Palette de couleurs
                </h2>
                <p className="mt-1 text-sm text-[#998590]">
                  Les teintes proposées pour ta création.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              {palette.map((color, index) => (
                <div
                  key={`${color}-${index}`}
                  className="flex flex-col items-center gap-2"
                  title={color}
                >
                  <span
                    className="h-12 w-12 rounded-full border border-black/10 shadow-sm sm:h-14 sm:w-14"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-medium text-[#806C7A]">
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Matériel */}
        <section className="mt-10 rounded-4xl border border-pink-100 bg-white p-6 shadow-sm sm:mt-14 sm:p-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-pink-500">
                Avant de commencer
              </span>

              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                Ton matériel créatif
              </h2>

              <p className="mt-2 text-sm text-[#998590]">
                Coche les éléments que tu as déjà préparés.
              </p>
            </div>

            <span className="rounded-2xl bg-pink-50 p-3 text-pink-500">
              <Heart size={24} />
            </span>
          </div>

          {materials.length > 0 ? (
            <>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {materials.map((material, index) => {
                  const checked = validCheckedMaterials.includes(index)

                  return (
                    <button
                      key={`${material}-${index}`}
                      type="button"
                      onClick={() => toggleMaterial(index)}
                      aria-pressed={checked}
                      className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                        checked
                          ? 'border-pink-300 bg-pink-50'
                          : 'border-[#F3E8EE] bg-[#FFFCFA] hover:border-pink-200'
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                          checked
                            ? 'border-pink-500 bg-pink-500 text-white'
                            : 'border-pink-200 bg-white'
                        }`}
                      >
                        {checked && <Check size={15} />}
                      </span>

                      <span
                        className={`text-sm font-medium ${
                          checked
                            ? 'text-pink-700 line-through'
                            : 'text-[#493747]'
                        }`}
                      >
                        {material}
                      </span>
                    </button>
                  )
                })}
              </div>

              <p className="mt-4 text-sm text-[#998590]">
                {validCheckedMaterials.length} / {materials.length} éléments préparés
              </p>
            </>
          ) : (
            <p className="mt-5 text-sm text-[#998590]">
              Aucun matériel particulier n'a été renseigné pour ce tutoriel.
            </p>
          )}
        </section>

        {/* Conseils de séchage et cuisson */}
        {cure && (
          <section className="mt-6 rounded-[2rem] border border-amber-200 bg-amber-50/80 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="rounded-xl bg-white p-3 text-amber-700 shadow-sm">
                <Lightbulb size={23} />
              </span>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                  Séchage et finition
                </p>

                <h2 className="mt-2 text-xl font-extrabold">
                  {cureLabel(cure)}
                </h2>

                {cure.note && (
                  <p className="mt-3 text-sm leading-7 text-[#806C7A]">
                    {cure.note}
                  </p>
                )}

                <p className="mt-3 text-xs leading-5 text-[#806C7A]">
                  Suis toujours les instructions du fabricant de ta pâte,
                  notamment pour la température et la durée de cuisson.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Étapes */}
        <section id="etapes" className="mt-14 scroll-mt-8 sm:mt-20">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-pink-500">
                À toi de jouer
              </span>

              <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                Les étapes de création
              </h2>

              <p className="mt-3 text-[#998590]">
                Prends ton temps et avance à ton rythme.
              </p>
            </div>

            <div className="w-full rounded-2xl bg-white p-4 shadow-sm sm:max-w-xs">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold">Ta progression</span>
                <span className="font-extrabold text-pink-600">
                  {progress}%
                </span>
              </div>

              <div
                className="h-2.5 overflow-hidden rounded-full bg-pink-100"
                role="progressbar"
                aria-label="Progression du tutoriel"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div
                  className="h-full rounded-full bg-pink-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-[#998590]">
                {validCompletedSteps.length} étape(s) sur {instructions.length}
              </p>
            </div>
          </div>

          {instructions.length > 0 ? (
            <div className="mt-8 space-y-5">
              {instructions.map((step, index) => {
                const completed = validCompletedSteps.includes(index)

                return (
                  <article
                    key={`${step.title}-${index}`}
                    className={`rounded-[1.75rem] border bg-white p-5 shadow-sm transition sm:p-7 ${
                      completed
                        ? 'border-pink-300'
                        : 'border-pink-100'
                    }`}
                  >
                    <div className="flex items-start gap-4 sm:gap-6">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold ${
                          completed
                            ? 'bg-pink-500 text-white'
                            : 'bg-pink-100 text-pink-600'
                        }`}
                      >
                        {completed ? (
                          <CheckCircle2 size={23} />
                        ) : (
                          String(index + 1).padStart(2, '0')
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold sm:text-xl">
                            {step.title}
                          </h3>

                          {step.duration && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                              <Clock3 size={13} />
                              {step.duration}
                            </span>
                          )}
                        </div>

                        <p className="mt-3 leading-7 text-[#806C7A]">
                          {step.description}
                        </p>

                        {step.tip && (
                          <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900">
                            <Lightbulb size={17} className="mt-1 shrink-0" />
                            <p>{step.tip}</p>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => toggleStep(index)}
                          aria-pressed={completed}
                          className={`mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                            completed
                              ? 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                              : 'bg-[#FFF1F6] text-pink-600 hover:bg-pink-100'
                          }`}
                        >
                          {completed ? (
                            <>
                              <CheckCircle2 size={17} />
                              Étape terminée
                            </>
                          ) : (
                            <>
                              <Check size={17} />
                              Marquer comme terminée
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <p className="mt-8 rounded-2xl bg-white p-6 text-sm text-[#998590]">
              Les étapes de ce tutoriel seront bientôt disponibles.
            </p>
          )}

          {progress === 100 && instructions.length > 0 && (
            <div className="mt-8 rounded-4xl border border-pink-200 bg-pink-50 p-8 text-center">
              <div className="text-4xl">🌷</div>

              <h3 className="mt-3 text-2xl font-extrabold">
                Bravo, tu as terminé !
              </h3>

              <p className="mt-2 text-[#806C7A]">
                Ta création est terminée. Félicitations pour ce joli projet !
              </p>

              <Link
                to="/creations"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-pink-500 px-6 py-3 font-bold text-white transition hover:bg-pink-600"
              >
                Explorer les créations
                <ArrowRight size={18} />
              </Link>
            </div>
          )}

          {(validCompletedSteps.length > 0 || validCheckedMaterials.length > 0) && (
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={resetProgress}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#998590] transition hover:bg-white hover:text-pink-600"
              >
                <RotateCcw size={15} />
                Réinitialiser ma progression
              </button>
            </div>
          )}
        </section>

        {/* Conseils, erreurs et variantes */}
        {(tips.length > 0 || mistakes.length > 0 || variations.length > 0) && (
          <section className="mt-14 sm:mt-20">
            <div className="mb-7">
              <span className="text-sm font-bold uppercase tracking-widest text-pink-500">
                Les petits secrets de l'atelier
              </span>

              <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                Pour une création réussie
              </h2>

              <p className="mt-3 text-[#998590]">
                Quelques astuces pour personnaliser ton résultat et éviter les erreurs courantes.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <InfoSection
                title="Conseils pratiques"
                icon={Lightbulb}
                items={tips}
                color="pink"
              />

              <InfoSection
                title="Erreurs à éviter"
                icon={TriangleAlert}
                items={mistakes}
                color="amber"
              />

              <div className="lg:col-span-2">
                <InfoSection
                  title="Essaie aussi ces variantes"
                  icon={Sparkles}
                  items={variations}
                  color="purple"
                />
              </div>
            </div>
          </section>
        )}

        <div className="mt-14 text-center">
          <Link
            to="/creations"
            className="inline-flex items-center gap-2 font-semibold text-pink-600 hover:text-pink-700"
          >
            <ArrowLeft size={17} />
            Retour à toutes les créations
          </Link>
        </div>
      </main>

      <footer className="mt-16 border-t border-pink-100 bg-white px-5 py-8 text-center text-sm text-[#998590]">
        Fait avec amour et un peu de pâte créative 🌸 — ClayBloom
      </footer>
    </div>
  )
}

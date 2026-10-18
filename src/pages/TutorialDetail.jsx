import { useEffect, useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Heart,
  Lightbulb,
  Package,
  Palette,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  ImageOff,
} from 'lucide-react'

import useFavorites from '../hooks/useFavorites'
import { tutorials } from '../data/tutorials'

const STORAGE_PREFIX = 'claybloom:tutorial:'

/* --------------------------------
   LocalStorage helpers
--------------------------------- */

function readStorage(key) {
  try {
    const saved = window.localStorage.getItem(key)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function cureLabel(cure) {
  if (!cure) return null
  if (typeof cure === 'string') return cure
  if (typeof cure === 'object') {
    return cure.description || cure.label || cure.duration || cure.note || null
  }
  return String(cure)
}

/* --------------------------------
   Reusable information section
--------------------------------- */

function InfoSection({ title, icon: Icon, children, className = '' }) {
  return (
    <section
      className={`rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:p-6 ${className}`}
    >
      <div className="mb-4 flex items-center gap-3">
        {Icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-300">
            <Icon size={20} />
          </span>
        )}
        <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

/* --------------------------------
   Helper: Get translated content safely
--------------------------------- */

function getTranslatedContent(i18n, translationKey) {
  if (!translationKey) return {}

  const languages = [
    i18n.resolvedLanguage,
    i18n.language,
    i18n.resolvedLanguage?.split('-')[0],
    i18n.language?.split('-')[0],
  ].filter((language, index, array) =>
    language && array.indexOf(language) === index
  )

  for (const language of languages) {
    const bundle = i18n.getResourceBundle(language, 'translation')

    const content = bundle?.tutorialData?.[translationKey]

    if (
      content &&
      typeof content === 'object' &&
      !Array.isArray(content)
    ) {
      console.log('Traduction trouvée :', {
        language,
        translationKey,
        title: content.title,
      })

      return content
    }
  }

  console.warn('Traduction introuvable :', {
    translationKey,
    language: i18n.language,
    resolvedLanguage: i18n.resolvedLanguage,
  })

  return {}
}

/* --------------------------------
   Tutorial detail page
--------------------------------- */

export default function TutorialDetail() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()

  // 1. Retrieve the original tutorial
  const originalTutorial = tutorials.find(
    (item) => String(item.id) === String(id)
  )

  // 2. Get translation key
  const translationKey = originalTutorial?.translationKey

  // 3. Retrieve translated content with useMemo for optimization
const translatedContent = useMemo(
  () => getTranslatedContent(i18n, translationKey),
  [i18n, translationKey, i18n.language, i18n.resolvedLanguage]
)


  // 4. Merge translations with original data
  const tutorial = useMemo(() => {
    if (!originalTutorial) return null
    
    return {
      ...originalTutorial,
      // Les traductions écrasent les données originales si elles existent
      ...(translatedContent && Object.keys(translatedContent).length > 0
        ? translatedContent
        : {}),
    }
  }, [originalTutorial, translatedContent])
console.log('LANGUE ACTIVE :', i18n.language)
console.log('LANGUE RÉSOLUE :', i18n.resolvedLanguage)
console.log('TITRE TRADUIT :', translatedContent.title)
console.log('TITRE FINAL :', tutorial?.title)
console.log('MATÉRIEL FINAL :', tutorial?.materials?.[0])
  // 5. Favorites
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(id)

  // 6. Progress and materials storage keys
  const progressKey = `${STORAGE_PREFIX}${id}:steps`
  const materialsKey = `${STORAGE_PREFIX}${id}:materials`

  const [completedSteps, setCompletedSteps] = useState(() => readStorage(progressKey))
  const [checkedMaterials, setCheckedMaterials] = useState(() => readStorage(materialsKey))
  const [imageFailed, setImageFailed] = useState(false)

  // 7. Reload saved data when the tutorial changes
  useEffect(() => {
    setCompletedSteps(readStorage(progressKey))
    setCheckedMaterials(readStorage(materialsKey))
    setImageFailed(false)
  }, [progressKey, materialsKey])

  // 8. Persist completed steps
  useEffect(() => {
    try {
      window.localStorage.setItem(progressKey, JSON.stringify(completedSteps))
    } catch {
      // Local storage may be unavailable.
    }
  }, [progressKey, completedSteps])

  // 9. Persist checked materials
  useEffect(() => {
    try {
      window.localStorage.setItem(materialsKey, JSON.stringify(checkedMaterials))
    } catch {
      // Local storage may be unavailable.
    }
  }, [materialsKey, checkedMaterials])

  // 10. Handle an unknown tutorial ID
  if (!tutorial) {
    return (
      <main className="min-h-screen bg-stone-50 px-4 py-16 dark:bg-stone-950">
        <div className="mx-auto max-w-xl rounded-3xl border border-stone-200 bg-white p-8 text-center dark:border-stone-700 dark:bg-stone-900">
          <BookOpen size={44} className="mx-auto mb-4 text-pink-500" />
          <h1 className="mb-3 text-2xl font-bold text-stone-800 dark:text-stone-100">
            {t('tutorialDetail.notFound', { defaultValue: 'Tutoriel introuvable' })}
          </h1>
          <p className="mb-6 text-stone-600 dark:text-stone-400">
            {t('tutorialDetail.notFoundDescription', {
              defaultValue: "Ce tutoriel est introuvable ou n'est plus disponible.",
            })}
          </p>
          <Link
            to="/creations"
            className="inline-flex items-center gap-2 rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white transition hover:bg-pink-600"
          >
            <ArrowLeft size={18} />
            {t('tutorialDetail.backToCreations', { defaultValue: 'Retour aux créations' })}
          </Link>
        </div>
      </main>
    )
  }

  // 11. Safe collections
  const materials = Array.isArray(tutorial.materials) ? tutorial.materials : []
  const instructions = Array.isArray(tutorial.instructions) ? tutorial.instructions : []
  const tips = Array.isArray(tutorial.tips) ? tutorial.tips : []
  const commonMistakes = Array.isArray(tutorial.commonMistakes) ? tutorial.commonMistakes : []
  const variations = Array.isArray(tutorial.variations) ? tutorial.variations : []
  const palette = Array.isArray(tutorial.palette) ? tutorial.palette : []

  // 12. Progress calculations
  const totalSteps = instructions.length
  const completedCount = instructions.filter((_, index) => completedSteps.includes(index)).length
  const progress = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0
  const allMaterialsChecked = materials.length > 0 && materials.every((_, index) => checkedMaterials.includes(index))

  // 13. Step handlers
  function toggleStep(index) {
    setCompletedSteps((previous) =>
      previous.includes(index)
        ? previous.filter((step) => step !== index)
        : [...previous, index]
    )
  }

  // 14. Material handlers
  function toggleMaterial(index) {
    setCheckedMaterials((previous) =>
      previous.includes(index)
        ? previous.filter((item) => item !== index)
        : [...previous, index]
    )
  }

  // 15. Reset progress
  function resetProgress() {
    setCompletedSteps([])
    setCheckedMaterials([])
  }

  const translatedCure = cureLabel(tutorial.cure, t)

  return (
    <main className="min-h-screen bg-stone-50 pb-16 dark:bg-stone-950">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label={t('tutorialDetail.breadcrumbAria', { defaultValue: "Fil d'Ariane" })} className="mb-6">
          <Link
            to="/creations"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-pink-600 dark:text-stone-400 dark:hover:text-pink-400"
          >
            <ArrowLeft size={17} />
            {t('tutorialDetail.backToCreations', { defaultValue: 'Retour aux créations' })}
          </Link>
        </nav>

        {/* Hero */}
        <header className="mb-8 overflow-hidden rounded-3xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
          <div className="grid md:grid-cols-2">
            {/* Tutorial image */}
            <div className="relative flex min-h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-amber-100 dark:from-pink-950 dark:via-stone-900 dark:to-amber-950 md:min-h-[420px]">
              {tutorial.image && !imageFailed ? (
                <img
                  src={tutorial.image}
                  alt={tutorial.title}
                  onError={() => setImageFailed(true)}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 p-8 text-center text-pink-500">
                  <ImageOff size={48} />
                  <span className="text-sm font-medium">
                    {t('tutorialDetail.imageUnavailable', { defaultValue: 'Image indisponible' })}
                  </span>
                </div>
              )}
              {tutorial.level && (
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-stone-700 shadow-sm dark:bg-stone-900/95 dark:text-stone-200">
                  {tutorial.level}
                </span>
              )}
            </div>

            {/* Tutorial information */}
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              {tutorial.category && (
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-pink-600 dark:text-pink-400">
                  {tutorial.category}
                </p>
              )}
              <h1 className="mb-4 text-3xl font-extrabold leading-tight text-stone-800 dark:text-stone-100 sm:text-4xl">
                {tutorial.title}
              </h1>
              {tutorial.description && (
                <p className="mb-6 leading-7 text-stone-600 dark:text-stone-300">
                  {tutorial.description}
                </p>
              )}
              <div className="mb-6 flex flex-wrap gap-3">
                {tutorial.duration && (
                  <span className="inline-flex items-center gap-2 rounded-xl bg-stone-100 px-3 py-2 text-sm font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                    <Clock3 size={17} />
                    {tutorial.duration}
                  </span>
                )}
                {tutorial.cure && (
                  <span className="inline-flex items-center gap-2 rounded-xl bg-stone-100 px-3 py-2 text-sm font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                    <Sparkles size={17} />
                    {translatedCure}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => toggleFavorite(id)}
                aria-pressed={favorite}
                className={`inline-flex w-fit items-center gap-2 rounded-xl px-5 py-3 font-semibold transition ${
                  favorite
                    ? 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300'
                    : 'border border-stone-200 bg-white text-stone-700 hover:border-pink-300 hover:text-pink-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200'
                }`}
              >
                <Heart size={19} fill={favorite ? 'currentColor' : 'none'} />
                {favorite
                  ? t('tutorialDetail.removeFavorite', { defaultValue: 'Retirer des favoris' })
                  : t('tutorialDetail.addFavorite', { defaultValue: 'Ajouter aux favoris' })}
              </button>
            </div>
          </div>
        </header>

        {/* Progress Section - TOUJOURS AFFICHÉE */}
        <section className="mb-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-stone-800 dark:text-stone-100">
                {t('tutorialDetail.progressTitle', { defaultValue: 'Votre progression' })}
              </h2>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                {t('tutorialDetail.progressCount', {
                  completed: completedCount,
                  total: totalSteps,
                  defaultValue: `${completedCount} étape(s) sur ${totalSteps}`,
                })}
              </p>
            </div>
            <span className="text-2xl font-extrabold text-pink-600 dark:text-pink-400">
              {progress}%
            </span>
          </div>

          <div
            role="progressbar"
            aria-label={t('tutorialDetail.progressAria', { defaultValue: 'Progression du tutoriel' })}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="h-3 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {progress === 100 && totalSteps > 0 && (
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400">
              <CheckCircle2 size={18} />
              {t('tutorialDetail.completedMessage', { defaultValue: 'Bravo ! Vous avez terminé ce tutoriel.' })}
            </p>
          )}

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={resetProgress}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-500 transition hover:bg-stone-100 hover:text-stone-800 dark:hover:bg-stone-800 dark:hover:text-stone-200"
            >
              <RotateCcw size={15} />
              {t('tutorialDetail.resetProgress', { defaultValue: 'Réinitialiser la progression' })}
            </button>
          </div>
        </section>

        {/* Main content */}
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
          <div className="space-y-8">
            {/* Materials */}
            <InfoSection
              title={t('tutorialDetail.materialsTitle', { defaultValue: 'Matériel nécessaire' })}
              icon={Package}
            >
              {materials.length > 0 ? (
                <>
                  <p className="mb-4 text-sm text-stone-500 dark:text-stone-400">
                    {t('tutorialDetail.materialsHint', { defaultValue: 'Cochez les éléments que vous avez préparés.' })}
                  </p>
                  <ul className="space-y-3">
                    {materials.map((material, index) => {
                      const checked = checkedMaterials.includes(index)
                      return (
                        <li key={`${index}-${String(material)}`}>
                          <label
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                              checked
                                ? 'border-pink-200 bg-pink-50 dark:border-pink-900 dark:bg-pink-950/40'
                                : 'border-stone-200 hover:border-pink-200 dark:border-stone-700 dark:hover:border-pink-900'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleMaterial(index)}
                              className="mt-1 h-4 w-4 accent-pink-500"
                            />
                            <span
                              className={`text-sm leading-6 ${
                                checked
                                  ? 'text-stone-400 line-through dark:text-stone-500'
                                  : 'text-stone-700 dark:text-stone-300'
                              }`}
                            >
                              {material}
                            </span>
                          </label>
                        </li>
                      )
                    })}
                  </ul>
                  {allMaterialsChecked && (
                    <p className="mt-4 flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                      <CheckCircle2 size={17} />
                      {t('tutorialDetail.materialsReady', { defaultValue: 'Tout le matériel est prêt !' })}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {t('tutorialDetail.noMaterials', { defaultValue: 'Aucun matériel renseigné.' })}
                </p>
              )}
            </InfoSection>

            {/* Palette */}
            {palette.length > 0 && (
              <InfoSection
                title={t('tutorialDetail.paletteTitle', { defaultValue: 'Palette de couleurs' })}
                icon={Palette}
              >
                <div className="flex flex-wrap gap-3">
                  {palette.map((color, index) => {
                    const colorValue = typeof color === 'string' ? color : color.color || color.hex || '#E5E7EB'
                    const colorName = typeof color === 'string' ? color : color.name || color.label || colorValue
                    return (
                      <div key={`${colorValue}-${index}`} className="flex flex-col items-center gap-2" title={colorName}>
                        <span
                          className="h-10 w-10 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: colorValue }}
                        />
                        <span className="max-w-20 text-center text-xs text-stone-500 dark:text-stone-400">
                          {colorName}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </InfoSection>
            )}
          </div>

          {/* Instructions */}
          <InfoSection
            title={t('tutorialDetail.instructionsTitle', { defaultValue: 'Étapes de réalisation' })}
            icon={BookOpen}
          >
            {instructions.length > 0 ? (
              <ol className="space-y-5">
                {instructions.map((step, index) => {
                  const completed = completedSteps.includes(index)
                  const stepTitle = typeof step === 'string'
                    ? step
                    : step.title || t('tutorialDetail.stepLabel', { number: index + 1, defaultValue: `Étape ${index + 1}` })
                  const stepDescription = typeof step === 'string' ? '' : step.description || ''
                  const stepDuration = typeof step === 'object' ? step.duration : null
                  const stepTip = typeof step === 'object' ? step.tip : null

                  return (
                    <li
                      key={`${index}-${stepTitle}`}
                      className={`rounded-2xl border p-4 transition sm:p-5 ${
                        completed
                          ? 'border-green-200 bg-green-50/70 dark:border-green-900 dark:bg-green-950/20'
                          : 'border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleStep(index)}
                          aria-pressed={completed}
                          aria-label={
                            completed
                              ? t('tutorialDetail.markIncomplete', { title: stepTitle, defaultValue: `Marquer ${stepTitle} comme non terminée` })
                              : t('tutorialDetail.markComplete', { title: stepTitle, defaultValue: `Marquer ${stepTitle} comme terminée` })
                          }
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                            completed
                              ? 'bg-green-500 text-white'
                              : 'bg-pink-100 text-pink-600 hover:bg-pink-200 dark:bg-pink-950 dark:text-pink-300'
                          }`}
                        >
                          {completed ? <Check size={18} /> : <span className="text-sm font-bold">{index + 1}</span>}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className={`font-bold ${completed ? 'text-green-700 dark:text-green-400' : 'text-stone-800 dark:text-stone-100'}`}>
                              {stepTitle}
                            </h3>
                            {stepDuration && (
                              <span className="inline-flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
                                <Clock3 size={14} />
                                {stepDuration}
                              </span>
                            )}
                          </div>
                          {stepDescription && (
                            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-600 dark:text-stone-300">
                              {stepDescription}
                            </p>
                          )}
                          {stepTip && (
                            <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                              <Lightbulb size={17} className="mt-1 shrink-0" />
                              <p>{stepTip}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            ) : (
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {t('tutorialDetail.noInstructions', { defaultValue: 'Aucune étape renseignée pour le moment.' })}
              </p>
            )}
          </InfoSection>
        </div>

        {/* Additional advice */}
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {tips.length > 0 && (
            <InfoSection
              title={t('tutorialDetail.tipsTitle', { defaultValue: 'Conseils pratiques' })}
              icon={Lightbulb}
            >
              <ul className="space-y-3">
                {tips.map((tip, index) => (
                  <li key={`${index}-${tip}`} className="flex items-start gap-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
                    <CheckCircle2 size={18} className="mt-1 shrink-0 text-green-500" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </InfoSection>
          )}

          {commonMistakes.length > 0 && (
            <InfoSection
              title={t('tutorialDetail.mistakesTitle', { defaultValue: 'Erreurs à éviter' })}
              icon={AlertTriangle}
            >
              <ul className="space-y-3">
                {commonMistakes.map((mistake, index) => (
                  <li key={`${index}-${mistake}`} className="flex items-start gap-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
                    <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-500" />
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </InfoSection>
          )}
        </div>

        {/* Variations */}
        {variations.length > 0 && (
          <div className="mt-8">
            <InfoSection
              title={t('tutorialDetail.variationsTitle', { defaultValue: 'Idées de variations' })}
              icon={Sparkles}
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {variations.map((variation, index) => (
                  <div
                    key={`${index}-${variation}`}
                    className="rounded-xl border border-pink-100 bg-pink-50/70 p-4 text-sm leading-6 text-stone-700 dark:border-pink-900/50 dark:bg-pink-950/20 dark:text-stone-300"
                  >
                    {variation}
                  </div>
                ))}
              </div>
            </InfoSection>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-10 text-center">
          <p className="mb-4 text-sm text-stone-500 dark:text-stone-400">
            {t('tutorialDetail.footerMessage', { defaultValue: 'Prenez votre temps et amusez-vous à créer !' })}
          </p>
          <Link
            to="/creations"
            className="inline-flex items-center gap-2 rounded-xl bg-pink-500 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-pink-600"
          >
            <ArrowLeft size={18} />
            {t('tutorialDetail.backToCreations', { defaultValue: 'Retour aux créations' })}
          </Link>
        </footer>
      </div>
    </main>
  )
}
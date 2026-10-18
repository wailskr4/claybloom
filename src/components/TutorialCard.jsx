
import { ArrowRight, BookOpen, Clock3, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function TutorialCard({
  tutorial,
  isFavorite = false,
  onToggleFavorite,
  progress,
}) {
const { t, i18n } = useTranslation()

// Récupérer la traduction du tutoriel
const translatedTutorial = tutorial.translationKey
  ? i18n.getResourceBundle(
      i18n.resolvedLanguage || i18n.language,
      'translation'
    )?.tutorialData?.[tutorial.translationKey]
  : null

const translatedTitle =
  translatedTutorial?.title || tutorial.title

// Traduire le niveau avec une clé stable
const levelKeys = {
  'Débutant': 'beginner',
  'Intermédiaire': 'intermediate',
  'Avancé': 'advanced',
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
}

const levelKey = levelKeys[tutorial.level] || tutorial.level

const translatedLevel = t(`creations.levels.${levelKey}`, {
  defaultValue: tutorial.level,
})

  const translatedStatus = progress
    ? t(`creations.progress.${progress.status === 'Terminé'
        ? 'completed'
        : progress.status === 'En cours'
          ? 'inProgress'
          : 'notStarted'}`)
    : ''

  const isCompleted = progress?.status === 'Terminé'
  const isInProgress = progress?.status === 'En cours'

  return (
    <article className="group overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-100 dark:border-[#3d2f47] dark:bg-[#2b2438] dark:hover:shadow-purple-950/30">
      <div className="relative overflow-hidden">
        <img
          src={tutorial.image}
alt={translatedTitle}          loading="lazy"
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-pink-600 shadow-sm dark:bg-[#2b2438]/95 dark:text-pink-300">
          {translatedLevel}
        </span>

        <button
          type="button"
          onClick={() => onToggleFavorite?.(tutorial.id)}
          aria-label={t(
            isFavorite
              ? 'tutorialDetail.removeFavorite'
              : 'tutorialDetail.addFavorite'
          )}
          aria-pressed={isFavorite}
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition ${
            isFavorite
              ? 'bg-pink-500 text-white'
              : 'bg-white/95 text-pink-500 hover:bg-pink-500 hover:text-white dark:bg-[#2b2438]/95 dark:text-pink-300 dark:hover:bg-pink-500 dark:hover:text-white'
          }`}
        >
          <Heart
            size={18}
            fill={isFavorite ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <div className="p-5">
<h3 className="text-lg font-bold text-[#493747] dark:text-[#f7e8ef]">
  {translatedTitle}
</h3>

        {progress && (
          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  isCompleted
                    ? 'bg-green-100 text-green-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                    : isInProgress
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                      : 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300'
                }`}
              >
                {translatedStatus}
              </span>

              <span className="text-xs font-semibold text-[#887985] dark:text-[#c4b5c2]">
                {progress.percentage} %
              </span>
            </div>

            <div
              className="h-2 overflow-hidden rounded-full bg-pink-100 dark:bg-[#3a2f47]"
              role="progressbar"
              aria-label={t('tutorialCard.progressAria', {
title: translatedTitle,
              })}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress.percentage}
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500 dark:bg-emerald-400'
                    : 'bg-pink-500'
                }`}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>

            <p className="mt-1 text-xs text-[#998590] dark:text-[#c4b5c2]">
              {t('tutorialCard.stepsProgress', {
                completed: progress.completed,
                total: progress.total,
              })}
            </p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#998590] dark:text-[#c4b5c2]">
          <span className="flex items-center gap-1.5">
            <Clock3 size={15} />
            {tutorial.duration}
          </span>

          <span className="flex items-center gap-1.5">
            <BookOpen size={15} />
            {t('tutorialCard.stepsCount', {
              count: tutorial.steps,
            })}
          </span>
        </div>

        <Link
          to={`/tutoriels/${tutorial.id}`}
          className="mt-5 flex items-center justify-between border-t border-pink-50 pt-4 text-sm font-bold text-pink-600 hover:text-pink-700 dark:border-[#3d2f47] dark:text-pink-400 dark:hover:text-pink-300"
        >
          {t('tutorialCard.discoverGuide')}
          <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  )
}

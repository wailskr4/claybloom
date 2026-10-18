import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock,
  Download,
  Hammer,
  Lightbulb,
  ListChecks,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  Trash2,
  Trophy,
} from 'lucide-react'

const STORAGE_KEY = 'claybloom:techniques:v3'
const CUSTOM_TECHNIQUES_KEY = 'claybloom:custom-techniques:v1'
const ARRAY_FIELDS = ['objectives', 'materials', 'steps', 'exercise', 'mistakes']

// Filter keys live in the code (never translated); only display texts come from i18n.
const defaultTechniquesStructure = [
  {
    id: 'preparer-pate',
    image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=900&q=80',
    categoryKey: 'basics',
    levelKey: 'beginner',
    difficultyKey: 'easy',
    isCustom: false,
  },
  {
    id: 'formes-simples',
    image: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=80',
    categoryKey: 'gestures',
    levelKey: 'beginner',
    difficultyKey: 'easy',
    isCustom: false,
  },
  {
    id: 'petales-fleurs',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80',
    categoryKey: 'gestures',
    levelKey: 'beginner',
    difficultyKey: 'medium',
    isCustom: false,
  },
  {
    id: 'textures-details',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=80',
    categoryKey: 'decoration',
    levelKey: 'intermediate',
    difficultyKey: 'medium',
    isCustom: false,
  },
  {
    id: 'assemblage',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80',
    categoryKey: 'assembly',
    levelKey: 'intermediate',
    difficultyKey: 'medium',
    isCustom: false,
  },
  {
    id: 'finitions',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
    categoryKey: 'finishes',
    levelKey: 'intermediate',
    difficultyKey: 'hard',
    isCustom: false,
  },
]

function readProgress() {
  if (typeof window === 'undefined') {
    return { completed: [], exercises: {} }
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : {}

    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      exercises:
        parsed.exercises && typeof parsed.exercises === 'object'
          ? parsed.exercises
          : {},
    }
  } catch {
    return { completed: [], exercises: {} }
  }
}

function isValidCustom(item) {
  return (
    item &&
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    ARRAY_FIELDS.every((key) => Array.isArray(item[key]))
  )
}

function readCustomTechniques() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const parsed = JSON.parse(localStorage.getItem(CUSTOM_TECHNIQUES_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.filter(isValidCustom) : []
  } catch {
    return []
  }
}

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-bold text-stone-800 sm:text-3xl dark:text-[#f7e8ef]">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500 dark:text-[#c4b5c2]">
          {description}
        </p>
      )}
    </div>
  )
}

function TechniqueCard({ technique, done, onSelect, onDelete, isCustom, t }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-[#3d2f47] dark:bg-[#2b2438] dark:hover:shadow-purple-950/30">
      <div className="relative h-48 overflow-hidden bg-rose-50 dark:bg-[#211d2c]">
        <img
          src={technique.image}
          alt={technique.title}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-stone-700 dark:bg-[#2b2438]/95 dark:text-[#f7e8ef]">
          {technique.level}
        </span>
        {isCustom && (
          <span className="absolute left-3 top-12 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
            {t('buttons.custom')}
          </span>
        )}
        {done && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            <CheckCircle2 size={14} /> {t('buttons.completed')}
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-500 dark:text-pink-400">
          {technique.category}
        </p>
        <h3 className="text-lg font-bold text-stone-800 dark:text-[#f7e8ef]">
          {technique.title}
        </h3>
        <p className="mt-2 min-h-15 text-sm leading-6 text-stone-500 dark:text-[#c4b5c2]">
          {technique.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-stone-500 dark:text-[#c4b5c2]">
          <Clock size={16} />
          {technique.duration}
          <span className="mx-1">·</span>
          <ListChecks size={16} />
          {technique.exercise.length} {t('workshop.exercisesCompletedLabel')}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => onSelect(technique.id)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:bg-[#3a2f47] dark:text-pink-300 dark:hover:bg-[#4a3a56]"
          >
            {done ? t('buttons.review') : t('buttons.learn')}
            <ChevronRight size={17} />
          </button>

          {isCustom && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(technique.id)}
              className="flex items-center justify-center rounded-xl border border-rose-200 px-3 py-3 text-rose-600 transition hover:bg-rose-50 dark:border-[#4a3a56] dark:text-pink-400 dark:hover:bg-[#3a2f47]"
              title={t('buttons.delete')}
              aria-label={t('buttons.delete')}
            >
              <Trash2 size={17} />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

function fieldClass(hasError) {
  return `w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-rose-300 dark:bg-[#211d2c] dark:text-[#f7e8ef] dark:placeholder:text-[#6d5d72] dark:focus:border-pink-400 ${
    hasError
      ? 'border-red-300 dark:border-red-500/50'
      : 'border-rose-100 dark:border-[#3d2f47]'
  }`
}

const labelClass =
  'mb-1 block text-sm font-semibold text-stone-700 dark:text-[#c4b5c2]'

function AddTechniqueModal({ onClose, onAdd, t }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'basics',
    level: 'beginner',
    difficulty: 'easy',
    duration: '20 min',
    description: '',
    objectives: '',
    materials: '',
    steps: '',
    exercise: '',
    mistakes: '',
    tip: '',
    project: '',
    image: '',
  })

  const [errors, setErrors] = useState({})

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  function validate() {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = t('modal.errors.titleRequired')
    if (!formData.description.trim()) newErrors.description = t('modal.errors.descriptionRequired')
    if (!formData.objectives.trim()) newErrors.objectives = t('modal.errors.objectivesRequired')
    if (!formData.materials.trim()) newErrors.materials = t('modal.errors.materialsRequired')
    if (!formData.steps.trim()) newErrors.steps = t('modal.errors.stepsRequired')
    if (!formData.exercise.trim()) newErrors.exercise = t('modal.errors.exerciseRequired')
    if (!formData.mistakes.trim()) newErrors.mistakes = t('modal.errors.mistakesRequired')
    if (!formData.tip.trim()) newErrors.tip = t('modal.errors.tipRequired')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const toLines = (value) =>
    value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    const newTechnique = {
      id: `custom-${Date.now()}`,
      title: formData.title.trim(),
      categoryKey: formData.category,
      levelKey: formData.level,
      difficultyKey: formData.difficulty,
      duration: formData.duration,
      description: formData.description.trim(),
      objectives: toLines(formData.objectives),
      materials: toLines(formData.materials),
      steps: toLines(formData.steps),
      exercise: toLines(formData.exercise),
      mistakes: toLines(formData.mistakes),
      tip: formData.tip.trim(),
      project: formData.project.trim() || t('modal.defaultProject'),
      image:
        formData.image ||
        'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80',
      isCustom: true,
    }

    onAdd(newTechnique)
    onClose()
  }

  const categories = [
    { value: 'basics', label: t('categories.basics') },
    { value: 'gestures', label: t('categories.gestures') },
    { value: 'decoration', label: t('categories.decoration') },
    { value: 'assembly', label: t('categories.assembly') },
    { value: 'finishes', label: t('categories.finishes') },
    { value: 'custom', label: t('categories.custom') },
  ]

  const levels = [
    { value: 'beginner', label: t('levels.beginner') },
    { value: 'intermediate', label: t('levels.intermediate') },
    { value: 'advanced', label: t('levels.advanced') },
  ]

  const difficulties = [
    { value: 'easy', label: t('difficulties.easy') },
    { value: 'medium', label: t('difficulties.medium') },
    { value: 'hard', label: t('difficulties.hard') },
  ]

  const textareas = [
    { field: 'description', rows: 2 },
    { field: 'objectives', rows: 3 },
    { field: 'materials', rows: 2 },
    { field: 'steps', rows: 4 },
    { field: 'exercise', rows: 3 },
    { field: 'mistakes', rows: 2 },
    { field: 'tip', rows: 2 },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dark:bg-black/70">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-[#2b2438] dark:shadow-black/50">
        <div className="sticky top-0 flex items-center justify-between border-b border-rose-100 bg-white px-6 py-4 dark:border-[#3d2f47] dark:bg-[#2b2438]">
          <h2 className="text-xl font-bold text-stone-800 dark:text-[#f7e8ef]">{t('modal.title')}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('modal.close')}
            className="rounded-lg p-2 text-stone-400 hover:bg-rose-50 hover:text-stone-600 dark:text-[#8b7a91] dark:hover:bg-[#3a2f47] dark:hover:text-[#f7e8ef]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>{t('modal.form.title')}</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={fieldClass(errors.title)}
                placeholder={t('modal.form.titlePlaceholder')}
              />
              {errors.title && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.title}</p>}
            </div>

            <div>
              <label className={labelClass}>{t('modal.form.category')}</label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className={fieldClass(false)}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>{t('modal.form.level')}</label>
              <select
                value={formData.level}
                onChange={(e) => handleChange('level', e.target.value)}
                className={fieldClass(false)}
              >
                {levels.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>{t('modal.form.difficulty')}</label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className={fieldClass(false)}
              >
                {difficulties.map((diff) => (
                  <option key={diff.value} value={diff.value}>{diff.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>{t('modal.form.duration')}</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                className={fieldClass(false)}
                placeholder={t('modal.form.durationPlaceholder')}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>{t('modal.form.image')}</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
                className={fieldClass(false)}
                placeholder={t('modal.form.imagePlaceholder')}
              />
            </div>

            {textareas.map(({ field, rows }) => (
              <div key={field} className="sm:col-span-2">
                <label className={labelClass}>{t(`modal.form.${field}`)}</label>
                <textarea
                  value={formData[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  rows={rows}
                  className={fieldClass(errors[field])}
                  placeholder={t(`modal.form.${field}Placeholder`)}
                />
                {errors[field] && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors[field]}</p>
                )}
              </div>
            ))}

            <div className="sm:col-span-2">
              <label className={labelClass}>{t('modal.form.project')}</label>
              <input
                type="text"
                value={formData.project}
                onChange={(e) => handleChange('project', e.target.value)}
                className={fieldClass(false)}
                placeholder={t('modal.form.projectPlaceholder')}
              />
            </div>
          </div>

          <div className="flex gap-3 border-t border-rose-100 pt-4 dark:border-[#3d2f47]">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-rose-500 px-4 py-3 font-semibold text-white transition hover:bg-rose-600"
            >
              {t('modal.submit')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-rose-200 px-4 py-3 font-semibold text-stone-600 transition hover:bg-rose-50 dark:border-[#4a3a56] dark:text-[#c4b5c2] dark:hover:bg-[#3a2f47]"
            >
              {t('modal.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function escapeHtml(value = '') {
  const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }

  return String(value).replace(/[&<>"']/g, (char) => entities[char])
}

export default function Technique() {
  const { t, i18n } = useTranslation()
  const [progress, setProgress] = useState(readProgress)
  const [customTechniques, setCustomTechniques] = useState(readCustomTechniques)
  const [selectedId, setSelectedId] = useState('preparer-pate')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [level, setLevel] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [showCompleted, setShowCompleted] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  // Translated default techniques (filter keys come from the code, not from i18n)
  const defaultTechniques = useMemo(() => {
    return defaultTechniquesStructure.map((tech) => ({
      ...tech,
      title: t(`techniques.${tech.id}.title`),
      category: t(`categories.${tech.categoryKey}`),
      level: t(`levels.${tech.levelKey}`),
      difficulty: t(`difficulties.${tech.difficultyKey}`),
      duration: t(`techniques.${tech.id}.duration`),
      description: t(`techniques.${tech.id}.description`),
      objectives: t(`techniques.${tech.id}.objectives`, { returnObjects: true }),
      materials: t(`techniques.${tech.id}.materials`, { returnObjects: true }),
      steps: t(`techniques.${tech.id}.steps`, { returnObjects: true }),
      exercise: t(`techniques.${tech.id}.exercise`, { returnObjects: true }),
      mistakes: t(`techniques.${tech.id}.mistakes`, { returnObjects: true }),
      tip: t(`techniques.${tech.id}.tip`),
      project: t(`techniques.${tech.id}.project`),
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, i18n.language])

  const allTechniques = useMemo(() => {
    return [
      ...defaultTechniques,
      ...customTechniques.map((tech) => ({
        ...tech,
        category: t(`categories.${tech.categoryKey}`),
        level: t(`levels.${tech.levelKey}`),
        difficulty: t(`difficulties.${tech.difficultyKey}`),
      })),
    ]
  }, [defaultTechniques, customTechniques, t])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // Silent error
    }
  }, [progress])

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_TECHNIQUES_KEY, JSON.stringify(customTechniques))
    } catch {
      // Silent error
    }
  }, [customTechniques])

  const completedCount = allTechniques.filter((item) =>
    progress.completed.includes(item.id)
  ).length

  const totalExercises = allTechniques.reduce(
    (sum, item) => sum + item.exercise.length,
    0
  )

  const completedExercises = allTechniques.reduce((sum, item) => {
    const checked = progress.exercises[item.id] || []
    return (
      sum +
      item.exercise.filter((_, index) => checked.includes(index)).length
    )
  }, 0)

  const percentage = allTechniques.length
    ? Math.round((completedCount / allTechniques.length) * 100)
    : 0

  const filteredTechniques = useMemo(() => {
    const query = search.trim().toLowerCase()

    return allTechniques.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)

      const matchesCategory =
        category === 'all' ||
        (category === 'custom' ? item.isCustom : item.categoryKey === category)

      const matchesLevel = level === 'all' || item.levelKey === level

      const matchesDifficulty =
        difficulty === 'all' || item.difficultyKey === difficulty

      const matchesStatus =
        !showCompleted || progress.completed.includes(item.id)

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLevel &&
        matchesDifficulty &&
        matchesStatus
      )
    })
  }, [search, category, level, difficulty, showCompleted, progress.completed, allTechniques])

  const selected = allTechniques.find((item) => item.id === selectedId) || allTechniques[0]
  const selectedDone = progress.completed.includes(selected.id)
  const selectedExercises = progress.exercises[selected.id] || []

  function toggleExercise(index) {
    const id = selected.id
    setProgress((current) => {
      const currentList = current.exercises[id] || []
      const exists = currentList.includes(index)

      return {
        ...current,
        exercises: {
          ...current.exercises,
          [id]: exists
            ? currentList.filter((item) => item !== index)
            : [...currentList, index],
        },
      }
    })
  }

  function toggleCompleted() {
    const id = selected.id
    setProgress((current) => ({
      ...current,
      completed: current.completed.includes(id)
        ? current.completed.filter((item) => item !== id)
        : [...current.completed, id],
    }))
  }

  function resetProgress() {
    setProgress({ completed: [], exercises: {} })
    setShowResetConfirm(false)
  }

  function selectTechnique(id) {
    setSelectedId(id)
    setShowResetConfirm(false)
    document.getElementById('atelier-technique')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  function addTechnique(newTechnique) {
    setCustomTechniques((prev) => [...prev, newTechnique])
    setSelectedId(newTechnique.id)
  }

  function deleteTechnique(id) {
    if (window.confirm(t('modal.deleteConfirm'))) {
      setCustomTechniques((prev) => prev.filter((item) => item.id !== id))
      setProgress((current) => ({
        ...current,
        completed: current.completed.filter((itemId) => itemId !== id),
        exercises: Object.fromEntries(
          Object.entries(current.exercises).filter(([key]) => key !== id)
        ),
      }))
      if (selectedId === id) {
        setSelectedId('preparer-pate')
      }
    }
  }

  function exportToPDF() {
    const printableTechniques = allTechniques.map((tech) => ({
      ...tech,
      title: escapeHtml(tech.title),
      category: escapeHtml(tech.category),
      level: escapeHtml(tech.level),
      difficulty: escapeHtml(tech.difficulty),
      duration: escapeHtml(tech.duration),
      description: escapeHtml(tech.description),
      tip: escapeHtml(tech.tip),
      project: escapeHtml(tech.project),
      objectives: tech.objectives.map((item) => escapeHtml(item)),
      materials: tech.materials.map((item) => escapeHtml(item)),
      steps: tech.steps.map((item) => escapeHtml(item)),
      exercise: tech.exercise.map((item) => escapeHtml(item)),
      mistakes: tech.mistakes.map((item) => escapeHtml(item)),
    }))

    const printContent = `
  <!DOCTYPE html>
  <html lang="${escapeHtml(i18n.language)}">
  <head>
    <meta charset="UTF-8">
    <title>ClayBloom - ${escapeHtml(t('pdf.title'))}</title>
    <style>
      :root {
        --primary: #e11d48;
        --primary-light: #fff1f2;
        --text-main: #1c1917;
        --text-muted: #57534e;
        --border-color: #e7e5e4;
      }

      body { 
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
        line-height: 1.6; 
        color: var(--text-main); 
        max-width: 800px; 
        margin: 0 auto; 
        padding: 40px; 
      }

      header {
        text-align: center;
        margin-bottom: 40px;
        border-bottom: 2px solid var(--border-color);
        padding-bottom: 20px;
      }

      h1 { color: var(--primary); font-size: 28px; margin: 0 0 8px 0; }
      .subtitle { color: var(--text-muted); font-size: 14px; margin: 0; }

      .technique { 
        margin-bottom: 40px; 
        page-break-inside: avoid; 
        break-inside: avoid;
        border: 1px solid var(--border-color); 
        border-radius: 12px; 
        padding: 24px; 
        background: #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.02);
      }

      .technique-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px; }
      .technique-title { font-size: 20px; font-weight: 700; color: var(--text-main); margin: 0 0 12px 0; }
      
      .badges { display: flex; flex-wrap: wrap; gap: 8px; }
      .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
      .badge-category { background: var(--primary-light); color: #be123c; }
      .badge-level { background: #f5f5f4; color: var(--text-muted); }
      .badge-difficulty { background: #fef3c7; color: #92400e; }
      .badge-duration { background: #ecfdf5; color: #047857; }

      .description { color: var(--text-muted); margin-bottom: 20px; font-size: 15px; }

      .section { margin-bottom: 16px; }
      .section-title { font-size: 13px; font-weight: 700; color: var(--text-main); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
      
      ul, ol { margin: 0; padding-left: 20px; }
      li { margin-bottom: 4px; color: #44403c; font-size: 14px; }

      .tip { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 0 8px 8px 0; margin-top: 16px; }
      .tip-title { font-weight: 700; color: #92400e; margin-bottom: 4px; font-size: 14px; }
      .tip p { margin: 0; font-size: 14px; color: #78350f; }

      .mistakes { background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 0 8px 8px 0; padding: 12px 16px; margin-top: 16px; }
      .mistakes-title { font-weight: 700; color: #991b1b; margin-bottom: 6px; font-size: 14px; }

      .project { background: #ecfdf5; border-left: 4px solid #10b981; border-radius: 0 8px 8px 0; padding: 12px 16px; margin-top: 16px; }
      .project-title { font-weight: 700; color: #047857; margin-bottom: 4px; font-size: 14px; }
      .project p { margin: 0; font-size: 14px; color: #065f46; }

      .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border-color); text-align: center; color: #a8a29e; font-size: 12px; }

      @media print {
        body {
          padding: 10px;
          max-width: 100%;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .technique {
          border: 1px solid #ccc;
          box-shadow: none;
          margin-bottom: 20px;
          break-inside: avoid;
          page-break-inside: avoid;
        }
      }
    </style>
  </head>
  <body>
    <header>
      <h1>ClayBloom</h1>
      <p class="subtitle">${escapeHtml(t('pdf.subtitle', { count: printableTechniques.length, date: new Date().toLocaleDateString(i18n.language) }))}</p>
    </header>

    ${printableTechniques.map((tech) => `
      <div class="technique">
        <div class="technique-header">
          <div>
            <h2 class="technique-title">${tech.title || ''}</h2>
            <div class="badges">
              ${tech.category ? `<span class="badge badge-category">${tech.category}</span>` : ''}
              ${tech.level ? `<span class="badge badge-level">${tech.level}</span>` : ''}
              ${tech.difficulty ? `<span class="badge badge-difficulty">${tech.difficulty}</span>` : ''}
              ${tech.duration ? `<span class="badge badge-duration">${tech.duration}</span>` : ''}
            </div>
          </div>
        </div>

        ${tech.description ? `<p class="description">${tech.description}</p>` : ''}

        ${tech.objectives?.length ? `
          <div class="section">
            <p class="section-title">${escapeHtml(t('pdf.objectives'))}</p>
            <ul>
              ${tech.objectives.map((obj) => `<li>${obj}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${tech.materials?.length ? `
          <div class="section">
            <p class="section-title">${escapeHtml(t('pdf.materials'))}</p>
            <ul>
              ${tech.materials.map((mat) => `<li>${mat}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${tech.steps?.length ? `
          <div class="section">
            <p class="section-title">${escapeHtml(t('pdf.steps'))}</p>
            <ol>
              ${tech.steps.map((step) => `<li>${step}</li>`).join('')}
            </ol>
          </div>
        ` : ''}

        ${tech.exercise?.length ? `
          <div class="section">
            <p class="section-title">${escapeHtml(t('pdf.exercises'))}</p>
            <ul>
              ${tech.exercise.map((ex) => `<li>${ex}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${tech.tip ? `
          <div class="tip">
            <p class="tip-title">${escapeHtml(t('pdf.tip'))}</p>
            <p>${tech.tip}</p>
          </div>
        ` : ''}

        ${tech.mistakes?.length ? `
          <div class="mistakes">
            <p class="mistakes-title">${escapeHtml(t('pdf.mistakes'))}</p>
            <ul>
              ${tech.mistakes.map((mist) => `<li>${mist}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${tech.project ? `
          <div class="project">
            <p class="project-title">${escapeHtml(t('pdf.project'))}</p>
            <p>${tech.project}</p>
          </div>
        ` : ''}
      </div>
    `).join('') || `<p>${escapeHtml(t('library.emptyState.title'))}</p>`}

    <div class="footer">
      <p>${escapeHtml(t('pdf.footer'))}</p>
      <p>${escapeHtml(t('pdf.progress', { percentage, completed: completedCount, total: printableTechniques.length }))}</p>
    </div>
  </body>
  </html>
    `

    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '1px'
    iframe.style.height = '1px'
    iframe.style.border = '0'
    iframe.style.opacity = '0'

    document.body.appendChild(iframe)

    const printDocument = iframe.contentDocument || iframe.contentWindow.document

    printDocument.open()
    printDocument.write(printContent)
    printDocument.close()

    const printFrame = iframe.contentWindow

    printFrame.addEventListener(
      'afterprint',
      () => {
        iframe.remove()
      },
      { once: true }
    )

    window.setTimeout(() => {
      try {
        printFrame.focus()
        printFrame.print()
      } catch (error) {
        console.error('Print error:', error)
        iframe.remove()
        alert(t('pdf.printError'))
      }
    }, 1000)
  }

  const categories = [
    { value: 'all', label: t('categories.all') },
    { value: 'basics', label: t('categories.basics') },
    { value: 'gestures', label: t('categories.gestures') },
    { value: 'decoration', label: t('categories.decoration') },
    { value: 'assembly', label: t('categories.assembly') },
    { value: 'finishes', label: t('categories.finishes') },
    { value: 'custom', label: t('categories.custom') },
  ]

  const levels = [
    { value: 'all', label: t('levels.all') },
    { value: 'beginner', label: t('levels.beginner') },
    { value: 'intermediate', label: t('levels.intermediate') },
    { value: 'advanced', label: t('levels.advanced') },
  ]

  const difficulties = [
    { value: 'all', label: t('difficulties.all') },
    { value: 'easy', label: t('difficulties.easy') },
    { value: 'medium', label: t('difficulties.medium') },
    { value: 'hard', label: t('difficulties.hard') },
  ]

  return (
    <main className="min-h-screen bg-[#fffaf8] pb-16 text-stone-800 dark:bg-[#211d2c] dark:text-[#f7e8ef]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-rose-100 via-orange-50 to-amber-50 dark:from-[#2f2438] dark:via-[#251f30] dark:to-[#2a2235]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-4 py-2 text-sm font-medium text-rose-700 dark:border-[#4a3a56] dark:bg-[#2b2438]/80 dark:text-pink-300">
              <Sparkles size={16} />
              {t('hero.badge')}
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-stone-800 sm:text-5xl lg:text-6xl dark:text-[#f7e8ef]">
              {t('hero.title')}
              <span className="block text-rose-500 dark:text-pink-400">
                {t('hero.titleHighlight')}
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-stone-600 sm:text-lg dark:text-[#c4b5c2]">
              {t('hero.description')}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => selectTechnique(allTechniques[0].id)}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-6 py-3.5 font-semibold text-white shadow-md shadow-rose-200 transition hover:bg-rose-600 dark:shadow-none"
              >
                {t('hero.startButton')}
                <ChevronRight size={18} />
              </button>

              <button
                type="button"
                onClick={exportToPDF}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-6 py-3.5 font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50 dark:border-[#4a3a56] dark:bg-[#2b2438] dark:text-pink-300 dark:hover:bg-[#3a2f47]"
              >
                <Download size={18} />
                {t('hero.exportButton')}
              </button>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-purple-300 bg-white px-6 py-3.5 font-semibold text-purple-700 shadow-sm transition hover:bg-purple-50 dark:border-purple-500/40 dark:bg-[#2b2438] dark:text-purple-300 dark:hover:bg-[#3a2f47]"
              >
                <Plus size={18} />
                {t('hero.newTechniqueButton')}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-4xl bg-white/40 blur-xl dark:bg-white/5" />
            <div className="relative rounded-4xl border border-white/70 bg-white/60 p-5 shadow-xl backdrop-blur sm:p-7 dark:border-[#3d2f47] dark:bg-[#2b2438]/80">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-stone-500 dark:text-[#c4b5c2]">
                    {t('hero.progressLabel')}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-stone-800 dark:text-[#f7e8ef]">
                    {percentage}%
                  </p>
                </div>
                <div className="rounded-2xl bg-rose-100 p-4 text-rose-600 dark:bg-[#3a2f47] dark:text-pink-300">
                  <Trophy size={28} />
                </div>
              </div>

              <div
                className="mt-5 h-3 overflow-hidden rounded-full bg-rose-100 dark:bg-[#3a2f47]"
                role="progressbar"
                aria-label={t('hero.progressLabel')}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percentage}
              >
                <div
                  className="h-full rounded-full bg-linear-to-r from-rose-400 to-orange-300 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white p-4 dark:bg-[#211d2c]">
                  <BookOpen className="text-rose-500 dark:text-pink-400" size={21} />
                  <p className="mt-3 text-2xl font-bold">{completedCount}</p>
                  <p className="mt-1 text-xs text-stone-500 dark:text-[#c4b5c2]">
                    {t('hero.techniquesCompleted')}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 dark:bg-[#211d2c]">
                  <Target className="text-rose-500 dark:text-pink-400" size={21} />
                  <p className="mt-3 text-2xl font-bold">
                    {completedExercises}/{totalExercises}
                  </p>
                  <p className="mt-1 text-xs text-stone-500 dark:text-[#c4b5c2]">
                    {t('hero.exercisesDone')}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-stone-500 dark:text-[#c4b5c2]">
                {t('hero.motivationText')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Library */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionTitle
            eyebrow={t('library.eyebrow')}
            title={t('library.title')}
            description={t('library.description')}
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-600"
            >
              <Plus size={17} />
              {t('library.addButton')}
            </button>
            <button
              type="button"
              onClick={exportToPDF}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-[#4a3a56] dark:bg-[#2b2438] dark:text-pink-300 dark:hover:bg-[#3a2f47]"
            >
              <Download size={17} />
              {t('library.pdfButton')}
            </button>
          </div>
        </div>

        <div className="mb-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_200px_160px_160px_auto]">
          <label className="relative block">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-[#6d5d72]"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('library.searchPlaceholder')}
              aria-label={t('library.searchPlaceholder')}
              className="w-full rounded-xl border border-rose-100 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100 dark:border-[#3d2f47] dark:bg-[#2b2438] dark:text-[#f7e8ef] dark:placeholder:text-[#6d5d72] dark:focus:border-pink-400 dark:focus:ring-pink-500/20"
            />
          </label>

          <label className="relative">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label={t('library.categoryLabel')}
              className="w-full appearance-none rounded-xl border border-rose-100 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-rose-300 dark:border-[#3d2f47] dark:bg-[#2b2438] dark:text-[#f7e8ef] dark:focus:border-pink-400"
            >
              {categories.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-[#6d5d72]"
            />
          </label>

          <label className="relative">
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              aria-label={t('library.levelLabel')}
              className="w-full appearance-none rounded-xl border border-rose-100 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-rose-300 dark:border-[#3d2f47] dark:bg-[#2b2438] dark:text-[#f7e8ef] dark:focus:border-pink-400"
            >
              {levels.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-[#6d5d72]"
            />
          </label>

          <label className="relative">
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
              aria-label={t('library.difficultyLabel')}
              className="w-full appearance-none rounded-xl border border-rose-100 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-rose-300 dark:border-[#3d2f47] dark:bg-[#2b2438] dark:text-[#f7e8ef] dark:focus:border-pink-400"
            >
              {difficulties.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-[#6d5d72]"
            />
          </label>

          <button
            type="button"
            onClick={() => setShowCompleted((value) => !value)}
            aria-pressed={showCompleted}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              showCompleted
                ? 'border-rose-400 bg-rose-100 text-rose-700 dark:border-pink-400 dark:bg-[#3a2f47] dark:text-pink-300'
                : 'border-rose-100 bg-white text-stone-600 hover:bg-rose-50 dark:border-[#3d2f47] dark:bg-[#2b2438] dark:text-[#c4b5c2] dark:hover:bg-[#3a2f47]'
            }`}
          >
            {showCompleted ? t('library.showAll') : t('library.showCompleted')}
          </button>
        </div>

        {filteredTechniques.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredTechniques.map((item) => (
              <TechniqueCard
                key={item.id}
                technique={item}
                done={progress.completed.includes(item.id)}
                onSelect={selectTechnique}
                onDelete={item.isCustom ? deleteTechnique : null}
                isCustom={item.isCustom}
                t={t}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-rose-200 bg-white px-6 py-12 text-center dark:border-[#4a3a56] dark:bg-[#2b2438]">
            <Search className="mx-auto text-rose-400" size={30} />
            <h3 className="mt-4 font-bold">{t('library.emptyState.title')}</h3>
            <p className="mt-2 text-sm text-stone-500 dark:text-[#c4b5c2]">
              {t('library.emptyState.description')}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setCategory('all')
                setLevel('all')
                setDifficulty('all')
                setShowCompleted(false)
              }}
              className="mt-4 font-semibold text-rose-600 hover:text-rose-700 dark:text-pink-400 dark:hover:text-pink-300"
            >
              {t('library.emptyState.resetButton')}
            </button>
          </div>
        )}
      </section>

      {/* Interactive workshop */}
      <section
        id="atelier-technique"
        className="scroll-mt-8 border-y border-rose-100 bg-white dark:border-[#3d2f47] dark:bg-[#251f30]"
      >
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
          <SectionTitle
            eyebrow={t('workshop.eyebrow')}
            title={t('workshop.title')}
            description={t('workshop.description')}
          />

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="rounded-3xl border border-rose-100 bg-[#fffaf8] p-5 sm:p-8 dark:border-[#3d2f47] dark:bg-[#2b2438]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-[#3a2f47] dark:text-pink-300">
                  {selected.category}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-600 dark:bg-[#211d2c] dark:text-[#c4b5c2]">
                  {selected.level}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-600 dark:bg-[#211d2c] dark:text-[#c4b5c2]">
                  {selected.difficulty}
                </span>
                <span className="flex items-center gap-1 text-xs text-stone-500 dark:text-[#c4b5c2]">
                  <Clock size={14} />
                  {selected.duration}
                </span>
                {selected.isCustom && (
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                    {t('workshop.customBadge')}
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-2xl font-bold sm:text-3xl">
                {selected.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-[#c4b5c2]">
                {selected.description}
              </p>

              <div className="mt-7">
                <h4 className="flex items-center gap-2 font-bold">
                  <Target size={19} className="text-rose-500 dark:text-pink-400" />
                  {t('workshop.objectivesTitle')}
                </h4>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {selected.objectives.map((objective, index) => (
                    <li
                      key={`${index}-${objective}`}
                      className="flex items-start gap-2 rounded-xl bg-white p-3 text-sm text-stone-600 dark:bg-[#211d2c] dark:text-[#c4b5c2]"
                    >
                      <Check size={16} className="mt-0.5 shrink-0 text-rose-500 dark:text-pink-400" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7">
                <h4 className="flex items-center gap-2 font-bold">
                  <Hammer size={19} className="text-rose-500 dark:text-pink-400" />
                  {t('workshop.materialsTitle')}
                </h4>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {selected.materials.map((material, index) => (
                    <li
                      key={`${index}-${material}`}
                      className="flex items-start gap-2 rounded-xl bg-white p-3 text-sm text-stone-600 dark:bg-[#211d2c] dark:text-[#c4b5c2]"
                    >
                      <Check size={16} className="mt-0.5 shrink-0 text-rose-500 dark:text-pink-400" />
                      {material}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <h4 className="flex items-center gap-2 font-bold">
                  <BookOpen size={19} className="text-rose-500 dark:text-pink-400" />
                  {t('workshop.stepsTitle')}
                </h4>
                <ol className="mt-4 space-y-3">
                  {selected.steps.map((step, index) => (
                    <li key={`${index}-${step}`} className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700 dark:bg-[#3a2f47] dark:text-pink-300">
                        {index + 1}
                      </span>
                      <p className="pt-1 text-sm leading-6 text-stone-600 dark:text-[#c4b5c2]">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
                <h4 className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
                  <Lightbulb size={19} />
                  {t('workshop.tipTitle')}
                </h4>
                <p className="mt-2 text-sm leading-6 text-amber-900/80 dark:text-amber-200/80">
                  {selected.tip}
                </p>
              </div>

              <div className="mt-8">
                <h4 className="flex items-center gap-2 font-bold">
                  <Target size={19} className="text-rose-500 dark:text-pink-400" />
                  {t('workshop.exerciseTitle')}
                </h4>
                <p className="mt-2 text-sm text-stone-500 dark:text-[#c4b5c2]">
                  {t('workshop.exerciseDescription')}
                </p>

                <div className="mt-4 space-y-3">
                  {selected.exercise.map((task, index) => {
                    const checked = selectedExercises.includes(index)

                    return (
                      <label
                        key={`${index}-${task}`}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                          checked
                            ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10'
                            : 'border-rose-100 bg-white hover:border-rose-200 dark:border-[#3d2f47] dark:bg-[#211d2c] dark:hover:border-pink-500/40'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleExercise(index)}
                          className="mt-1 h-4 w-4 accent-rose-500"
                        />
                        <span
                          className={`text-sm leading-6 ${
                            checked
                              ? 'text-emerald-800 dark:text-emerald-200'
                              : 'text-stone-700 dark:text-[#c4b5c2]'
                          }`}
                        >
                          {task}
                        </span>
                        {checked && (
                          <CheckCircle2
                            size={18}
                            className="ml-auto mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                          />
                        )}
                      </label>
                    )
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-stone-500 dark:text-[#c4b5c2]">
                  <span>{t('workshop.exercisesCompleted')}</span>
                  <span className="font-semibold text-stone-700 dark:text-[#f7e8ef]">
                    {selectedExercises.length}/{selected.exercise.length}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-rose-100 dark:bg-[#3a2f47]">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all"
                    style={{
                      width: `${
                        selected.exercise.length
                          ? (selectedExercises.length / selected.exercise.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={toggleCompleted}
                className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 font-semibold transition ${
                  selectedDone
                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/20'
                    : 'bg-rose-500 text-white hover:bg-rose-600'
                }`}
              >
                {selectedDone ? (
                  <>
                    <CheckCircle2 size={19} />
                    {t('workshop.unvalidateButton')}
                  </>
                ) : (
                  <>
                    <Check size={19} />
                    {t('workshop.validateButton')}
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-stone-400 dark:text-[#8b7a91]">
                {t('workshop.validationNote')}
              </p>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5 lg:sticky lg:top-6">
              <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-5 dark:border-[#3d2f47] dark:bg-[#2b2438]">
                <h4 className="font-bold">{t('workshop.journeyTitle')}</h4>
                <p className="mt-1 text-sm text-stone-500 dark:text-[#c4b5c2]">
                  {t('workshop.journeyDescription', { completed: completedCount, total: allTechniques.length })}
                </p>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white dark:bg-[#211d2c]">
                  <div
                    className="h-full rounded-full bg-rose-400 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <p className="mt-3 text-2xl font-bold text-rose-600 dark:text-pink-400">
                  {percentage}%
                </p>

                <div className="mt-5 space-y-2">
                  {allTechniques.map((item) => {
                    const done = progress.completed.includes(item.id)
                    const active = item.id === selected.id

                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => selectTechnique(item.id)}
                        className={`flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm transition ${
                          active
                            ? 'bg-white shadow-sm ring-1 ring-rose-200 dark:bg-[#211d2c] dark:ring-pink-500/40'
                            : 'hover:bg-white/70 dark:hover:bg-[#3a2f47]'
                        }`}
                      >
                        {done ? (
                          <CheckCircle2
                            size={18}
                            className="shrink-0 text-emerald-600 dark:text-emerald-400"
                          />
                        ) : (
                          <Circle
                            size={18}
                            className="shrink-0 text-stone-300 dark:text-[#5a4a63]"
                          />
                        )}
                        <span className="flex-1 font-medium truncate">
                          {item.title}
                        </span>
                        {item.isCustom && (
                          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                            {t('workshop.customBadge')}
                          </span>
                        )}
                        {active && (
                          <ChevronRight
                            size={16}
                            className="shrink-0 text-rose-500 dark:text-pink-400"
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-[#3d2f47] dark:bg-[#2b2438]">
                <h4 className="font-bold">{t('workshop.avoidTitle')}</h4>
                <ul className="mt-3 space-y-3">
                  {selected.mistakes.map((mistake, index) => (
                    <li
                      key={`${index}-${mistake}`}
                      className="flex items-start gap-2 text-sm leading-6 text-stone-600 dark:text-[#c4b5c2]"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-[#3d2f47] dark:bg-[#2b2438]">
                <h4 className="font-bold">{t('workshop.storageTitle')}</h4>
                <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-[#c4b5c2]">
                  {t('workshop.storageNote')}
                </p>

                {!showResetConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    className="mt-4 flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-rose-600 dark:text-[#c4b5c2] dark:hover:text-pink-400"
                  >
                    <RotateCcw size={16} />
                    {t('workshop.resetButton')}
                  </button>
                ) : (
                  <div className="mt-4 rounded-xl bg-rose-50 p-3 dark:bg-[#3a2f47]">
                    <p className="text-sm text-stone-700 dark:text-[#f7e8ef]">
                      {t('workshop.resetConfirm')}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={resetProgress}
                        className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white"
                      >
                        {t('workshop.confirmButton')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowResetConfirm(false)}
                        className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-stone-600 dark:bg-[#211d2c] dark:text-[#c4b5c2]"
                      >
                        {t('workshop.cancelButton')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
        <div className="rounded-3xl bg-linear-to-r from-rose-100 via-orange-50 to-amber-100 p-7 sm:p-10 dark:from-[#2f2438] dark:via-[#251f30] dark:to-[#2a2235]">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="rounded-2xl bg-white p-4 text-rose-500 shadow-sm dark:bg-[#2b2438] dark:text-pink-400">
              <Sparkles size={30} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                {t('cta.title')}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-600 dark:text-[#c4b5c2]">
                {t('cta.description')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => selectTechnique(allTechniques[0].id)}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50 dark:bg-[#2b2438] dark:text-pink-300 dark:hover:bg-[#3a2f47]"
            >
              {t('cta.button')}
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* Add modal */}
      {showAddModal && (
        <AddTechniqueModal
          onClose={() => setShowAddModal(false)}
          onAdd={addTechnique}
          t={t}
        />
      )}
    </main>
  )
}
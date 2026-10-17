import { useEffect, useMemo, useState } from 'react'
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

const defaultTechniques = [
  {
    id: 'preparer-pate',
    title: 'Préparer et assouplir la pâte',
    category: 'Les bases',
    level: 'Débutant',
    difficulty: 'Facile',
    duration: '15 min',
    image:
      'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=900&q=80',
    description:
      'Apprends à préparer une pâte homogène, à reconnaître une texture adaptée au modelage et à éviter les erreurs de départ.',
    objectives: [
      'Comprendre la texture idéale pour modeler',
      'Préparer une pâte souple et régulière',
      'Éviter les erreurs de préparation',
    ],
    materials: ['Pâte à modeler adaptée au projet', 'Surface propre', 'Outil de coupe adapté'],
    steps: [
      'Lire les instructions du fabricant et préparer la surface de travail.',
      'Prélever une petite quantité de pâte.',
      'Malaxer progressivement selon les recommandations du produit.',
      'Observer la texture et vérifier qu’elle se travaille facilement.',
      'Former une boule de test pour valider l’élasticité.',
    ],
    exercise: [
      'Préparer une petite portion de pâte.',
      'Former une boule régulière.',
      'Former un petit cylindre sans trop déformer la pâte.',
    ],
    mistakes: [
      'Travailler sur une surface sale.',
      'Malaxer une pâte qui ne nécessite pas cette préparation.',
      'Mélanger des produits incompatibles.',
    ],
    tip: 'Travaille par petites quantités. Si la pâte devient collante ou se fissure, vérifie les recommandations du fabricant avant de poursuivre.',
    project: 'Crée une petite boule parfaite et un cylindre régulier.',
    isCustom: false,
  },
  {
    id: 'formes-simples',
    title: 'Maîtriser les formes simples',
    category: 'Les gestes',
    level: 'Débutant',
    difficulty: 'Facile',
    duration: '20 min',
    image:
      'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=80',
    description:
      'Apprends à former des boules, des cylindres et des formes ovales pour construire tes créations.',
    objectives: [
      'Créer des formes régulières',
      'Maîtriser la pression des doigts',
      'Assembler des formes simples',
    ],
    materials: ['Pâte à modeler', 'Surface de travail', 'Règle facultative'],
    steps: [
      'Diviser la pâte en portions comparables.',
      'Faire rouler une portion entre les paumes pour former une boule.',
      'Rouler doucement pour obtenir un cylindre.',
      'Ajuster les extrémités pour obtenir une forme ovale.',
      'Comparer les formes pour vérifier la régularité.',
    ],
    exercise: [
      'Former trois boules de tailles différentes.',
      'Créer deux cylindres de longueurs différentes.',
      'Réaliser un petit ensemble de formes harmonieuses.',
    ],
    mistakes: [
      'Appuyer trop fort et déformer la pièce.',
      'Changer brusquement la pression des doigts.',
      'Ne pas vérifier la régularité des formes.',
    ],
    tip: 'Des mouvements légers et réguliers donnent généralement un résultat plus homogène.',
    project: 'Réalise une petite composition de 5 formes simples.',
    isCustom: false,
  },
  {
    id: 'petales-fleurs',
    title: 'Modeler des pétales et des feuilles',
    category: 'Les gestes',
    level: 'Débutant',
    difficulty: 'Moyen',
    duration: '25 min',
    image:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80',
    description:
      'Découvre comment transformer de petites portions de pâte en pétales et feuilles décoratives.',
    objectives: [
      'Créer des pétales fins et réguliers',
      'Ajouter des nervures naturelles',
      'Assembler une petite fleur',
    ],
    materials: ['Pâte de plusieurs couleurs', 'Petit outil arrondi', 'Surface lisse'],
    steps: [
      'Former de petites boules de pâte.',
      'Aplatir doucement chaque boule pour créer un pétale.',
      'Affiner légèrement une extrémité pour donner une forme naturelle.',
      'Former une feuille et ajouter une nervure si nécessaire.',
      'Assembler les pièces pour réaliser une petite fleur.',
    ],
    exercise: [
      'Créer cinq pétales de taille similaire.',
      'Former deux feuilles.',
      'Assembler les pièces pour réaliser une petite fleur.',
    ],
    mistakes: [
      'Faire des pétales trop épais pour le projet.',
      'Trop étirer une pièce fragile.',
      'Appuyer excessivement avec les outils.',
    ],
    tip: 'Prépare tes pièces avant de les assembler : cela facilite la régularité de la composition.',
    project: 'Réalise une fleur complète avec 5 pétales et 2 feuilles.',
    isCustom: false,
  },
  {
    id: 'textures-details',
    title: 'Créer des textures et des détails',
    category: 'Décoration',
    level: 'Intermédiaire',
    difficulty: 'Moyen',
    duration: '20 min',
    image:
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=80',
    description:
      'Ajoute des motifs, des reliefs et de petits détails pour personnaliser tes créations.',
    objectives: [
      'Créer des motifs réguliers',
      'Utiliser des outils de texture',
      'Personnaliser une pièce',
    ],
    materials: ['Pâte à modeler', 'Outils de texture', 'Objets texturés adaptés'],
    steps: [
      'Préparer une plaque de pâte d’épaisseur régulière.',
      'Choisir un outil propre et adapté.',
      'Tester la pression sur une chute de pâte.',
      'Répéter le motif avec un espacement régulier.',
      'Nettoyer l’outil entre chaque utilisation.',
    ],
    exercise: [
      'Créer trois motifs différents sur des chutes de pâte.',
      'Réaliser une rangée de motifs réguliers.',
      'Choisir une texture pour décorer une petite pièce.',
    ],
    mistakes: [
      'Appuyer trop fort et déchirer la surface.',
      'Utiliser un outil sale.',
      'Multiplier les motifs sans cohérence.',
    ],
    tip: 'Fais toujours un essai sur une chute avant de texturer ta création finale.',
    project: 'Décore une petite plaque avec 3 textures différentes.',
    isCustom: false,
  },
  {
    id: 'assemblage',
    title: 'Assembler plusieurs pièces',
    category: 'Assemblage',
    level: 'Intermédiaire',
    difficulty: 'Moyen',
    duration: '25 min',
    image:
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80',
    description:
      'Apprends à joindre plusieurs éléments pour obtenir une création stable et soignée.',
    objectives: [
      'Assembler des pièces sans les déformer',
      'Choisir la bonne méthode de liaison',
      'Vérifier la stabilité',
    ],
    materials: ['Pièces modelées', 'Outil adapté', 'Support de travail'],
    steps: [
      'Préparer les éléments et vérifier leur position.',
      'Identifier la méthode de liaison adaptée au type de pâte.',
      'Assembler doucement sans déformer les pièces.',
      'Vérifier la stabilité et respecter les consignes de séchage ou de cuisson.',
      'Laisser sécher ou cuire selon les instructions.',
    ],
    exercise: [
      'Créer deux formes simples.',
      'Les assembler pour former un petit objet.',
      'Vérifier la solidité de la jonction sans forcer.',
    ],
    mistakes: [
      'Assembler des pâtes incompatibles.',
      'Utiliser une méthode de collage non adaptée.',
      'Déplacer les pièces avant que la jonction soit stable.',
    ],
    tip: 'La méthode d’assemblage dépend du matériau : consulte les indications du fabricant avant d’ajouter de l’eau, de la colle ou un autre produit.',
    project: 'Assemble un petit objet en 3 pièces.',
    isCustom: false,
  },
  {
    id: 'finitions',
    title: 'Réussir les finitions',
    category: 'Finitions',
    level: 'Intermédiaire',
    difficulty: 'Difficile',
    duration: '20 min',
    image:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
    description:
      'Apprends à inspecter, corriger et protéger tes créations avec des produits compatibles.',
    objectives: [
      'Identifier les défauts',
      'Corriger les imperfections',
      'Appliquer une finition adaptée',
    ],
    materials: ['Création terminée', 'Outils de finition adaptés', 'Protection de surface si nécessaire'],
    steps: [
      'Examiner la pièce et repérer les imperfections.',
      'Corriger les défauts uniquement avec une méthode adaptée au matériau.',
      'Respecter le temps de séchage ou les instructions de cuisson.',
      'Appliquer une finition seulement si elle est compatible avec la pâte.',
      'Nettoyer les outils après utilisation.',
    ],
    exercise: [
      'Inspecter une petite création sous plusieurs angles.',
      'Identifier trois détails à améliorer.',
      'Rédiger une courte liste de vérification avant de considérer la pièce terminée.',
    ],
    mistakes: [
      'Appliquer un vernis avant le séchage complet.',
      'Utiliser une finition incompatible.',
      'Ignorer les consignes de ventilation ou de sécurité du produit.',
    ],
    tip: 'Les pâtes autodurcissantes et les pâtes polymères ne se traitent pas de la même façon. Suis toujours la notice du produit.',
    project: 'Termine une pièce avec une finition adaptée.',
    isCustom: false,
  },
]

const categories = ['Toutes', 'Les bases', 'Les gestes', 'Décoration', 'Assemblage', 'Finitions', 'Personnalisées']
const levels = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé']
const difficulties = ['Tous', 'Facile', 'Moyen', 'Difficile']

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

function readCustomTechniques() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const saved = localStorage.getItem(CUSTOM_TECHNIQUES_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed : []
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
      <h2 className="text-2xl font-bold text-stone-800 sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
          {description}
        </p>
      )}
    </div>
  )
}

function TechniqueCard({ technique, done, onSelect, onDelete, isCustom }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden bg-rose-50">
        <img
          src={technique.image}
          alt={`Illustration : ${technique.title}`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-stone-700">
          {technique.level}
        </span>
        {isCustom && (
          <span className="absolute left-3 top-12 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            Personnalisée
          </span>
        )}
        {done && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 size={14} /> Terminée
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-500">
          {technique.category}
        </p>
        <h3 className="text-lg font-bold text-stone-800">
          {technique.title}
        </h3>
        <p className="mt-2 min-h-15 text-sm leading-6 text-stone-500">
          {technique.description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-sm text-stone-500">
          <Clock size={16} />
          {technique.duration}
          <span className="mx-1">·</span>
          <ListChecks size={16} />
          {technique.exercise.length} exercices
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => onSelect(technique.id)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            {done ? 'Revoir' : 'Apprendre'}
            <ChevronRight size={17} />
          </button>
          
          {isCustom && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(technique.id)}
              className="flex items-center justify-center rounded-xl border border-rose-200 px-3 py-3 text-rose-600 transition hover:bg-rose-50"
              title="Supprimer"
            >
              <Trash2 size={17} />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

function AddTechniqueModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Les bases',
    level: 'Débutant',
    difficulty: 'Facile',
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
    if (!formData.title.trim()) newErrors.title = 'Le titre est requis'
    if (!formData.description.trim()) newErrors.description = 'La description est requise'
    if (!formData.objectives.trim()) newErrors.objectives = 'Les objectifs sont requis'
    if (!formData.materials.trim()) newErrors.materials = 'Le matériel est requis'
    if (!formData.steps.trim()) newErrors.steps = 'Les étapes sont requises'
    if (!formData.exercise.trim()) newErrors.exercise = 'Les exercices sont requis'
    if (!formData.mistakes.trim()) newErrors.mistakes = 'Les erreurs sont requises'
    if (!formData.tip.trim()) newErrors.tip = 'Le conseil est requis'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    const newTechnique = {
      id: `custom-${Date.now()}`,
      title: formData.title,
      category: formData.category === 'Personnalisées' ? 'Personnalisées' : formData.category,
      level: formData.level,
      difficulty: formData.difficulty,
      duration: formData.duration,
      description: formData.description,
      objectives: formData.objectives.split('\n').filter((item) => item.trim()),
      materials: formData.materials.split('\n').filter((item) => item.trim()),
      steps: formData.steps.split('\n').filter((item) => item.trim()),
      exercise: formData.exercise.split('\n').filter((item) => item.trim()),
      mistakes: formData.mistakes.split('\n').filter((item) => item.trim()),
      tip: formData.tip,
      project: formData.project || 'Projet libre',
      image: formData.image || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80',
      isCustom: true,
    }

    onAdd(newTechnique)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-rose-100 bg-white px-6 py-4">
          <h2 className="text-xl font-bold text-stone-800">Nouvelle technique</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-stone-400 hover:bg-rose-50 hover:text-stone-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-stone-700">
                Titre *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-rose-300 ${
                  errors.title ? 'border-red-300' : 'border-rose-100'
                }`}
                placeholder="Ex: Créer un bol en argile"
              />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-stone-700">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-300"
              >
                <option value="Les bases">Les bases</option>
                <option value="Les gestes">Les gestes</option>
                <option value="Décoration">Décoration</option>
                <option value="Assemblage">Assemblage</option>
                <option value="Finitions">Finitions</option>
                <option value="Personnalisées">Personnalisées</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-stone-700">
                Niveau
              </label>
              <select
                value={formData.level}
                onChange={(e) => handleChange('level', e.target.value)}
                className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-300"
              >
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-stone-700">
                Difficulté
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-300"
              >
                <option value="Facile">Facile</option>
                <option value="Moyen">Moyen</option>
                <option value="Difficile">Difficile</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-stone-700">
                Durée
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-300"
                placeholder="Ex: 30 min"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-stone-700">
                URL de l'image (optionnel)
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
                className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-300"
                placeholder="https://..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-stone-700">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={2}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-rose-300 ${
                  errors.description ? 'border-red-300' : 'border-rose-100'
                }`}
                placeholder="Décris la technique en une phrase..."
              />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-stone-700">
                Objectifs (un par ligne) *
              </label>
              <textarea
                value={formData.objectives}
                onChange={(e) => handleChange('objectives', e.target.value)}
                rows={3}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-rose-300 ${
                  errors.objectives ? 'border-red-300' : 'border-rose-100'
                }`}
                placeholder={"Maîtriser le geste de base\nCréer une forme régulière"}
              />
              {errors.objectives && <p className="mt-1 text-xs text-red-500">{errors.objectives}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-stone-700">
                Matériel nécessaire (un par ligne) *
              </label>
              <textarea
                value={formData.materials}
                onChange={(e) => handleChange('materials', e.target.value)}
                rows={2}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-rose-300 ${
                  errors.materials ? 'border-red-300' : 'border-rose-100'
                }`}
                placeholder={"Pâte à modeler\nOutil de coupe"}
              />
              {errors.materials && <p className="mt-1 text-xs text-red-500">{errors.materials}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-stone-700">
                Étapes à suivre (une par ligne) *
              </label>
              <textarea
                value={formData.steps}
                onChange={(e) => handleChange('steps', e.target.value)}
                rows={4}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-rose-300 ${
                  errors.steps ? 'border-red-300' : 'border-rose-100'
                }`}
                placeholder={"Préparer la surface\nFormer une boule\n..."}
              />
              {errors.steps && <p className="mt-1 text-xs text-red-500">{errors.steps}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-stone-700">
                Exercices pratiques (un par ligne) *
              </label>
              <textarea
                value={formData.exercise}
                onChange={(e) => handleChange('exercise', e.target.value)}
                rows={3}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-rose-300 ${
                  errors.exercise ? 'border-red-300' : 'border-rose-100'
                }`}
                placeholder={"Créer 3 boules\nFormer un cylindre"}
              />
              {errors.exercise && <p className="mt-1 text-xs text-red-500">{errors.exercise}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-stone-700">
                Erreurs à éviter (une par ligne) *
              </label>
              <textarea
                value={formData.mistakes}
                onChange={(e) => handleChange('mistakes', e.target.value)}
                rows={2}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-rose-300 ${
                  errors.mistakes ? 'border-red-300' : 'border-rose-100'
                }`}
                placeholder={"Appuyer trop fort\nNe pas vérifier la régularité"}
              />
              {errors.mistakes && <p className="mt-1 text-xs text-red-500">{errors.mistakes}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-stone-700">
                Conseil ClayBloom *
              </label>
              <textarea
                value={formData.tip}
                onChange={(e) => handleChange('tip', e.target.value)}
                rows={2}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-rose-300 ${
                  errors.tip ? 'border-red-300' : 'border-rose-100'
                }`}
                placeholder="Un conseil pratique pour réussir..."
              />
              {errors.tip && <p className="mt-1 text-xs text-red-500">{errors.tip}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-stone-700">
                Projet final (optionnel)
              </label>
              <input
                type="text"
                value={formData.project}
                onChange={(e) => handleChange('project', e.target.value)}
                className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-sm outline-none focus:border-rose-300"
                placeholder="Ex: Réaliser un petit vase décoratif"
              />
            </div>
          </div>

          <div className="flex gap-3 border-t border-rose-100 pt-4">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-rose-500 px-4 py-3 font-semibold text-white transition hover:bg-rose-600"
            >
              Ajouter la technique
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-rose-200 px-4 py-3 font-semibold text-stone-600 transition hover:bg-rose-50"
            >
              Annuler
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
  const [progress, setProgress] = useState(readProgress)
  const [customTechniques, setCustomTechniques] = useState(readCustomTechniques)
  const [selectedId, setSelectedId] = useState(defaultTechniques[0].id)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Toutes')
  const [level, setLevel] = useState('Tous')
  const [difficulty, setDifficulty] = useState('Tous')
  const [showCompleted, setShowCompleted] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  const allTechniques = useMemo(() => {
    return [...defaultTechniques, ...customTechniques]
  }, [customTechniques])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // La page reste utilisable même si le stockage est indisponible.
    }
  }, [progress])

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_TECHNIQUES_KEY, JSON.stringify(customTechniques))
    } catch {
      // Erreur silencieuse
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

  const percentage = Math.round(
    (completedCount / allTechniques.length) * 100
  )

  const filteredTechniques = useMemo(() => {
    const query = search.trim().toLowerCase()

    return allTechniques.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)

      const matchesCategory =
        category === 'Toutes' ||
        (category === 'Personnalisées' ? item.isCustom : item.category === category)

      const matchesLevel = level === 'Tous' || item.level === level

      const matchesDifficulty =
        difficulty === 'Tous' || item.difficulty === difficulty

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
  const selectedDone = progress.completed.includes(selectedId)
  const selectedExercises = progress.exercises[selectedId] || []

  function toggleExercise(index) {
    setProgress((current) => {
      const currentList = current.exercises[selectedId] || []
      const exists = currentList.includes(index)

      return {
        ...current,
        exercises: {
          ...current.exercises,
          [selectedId]: exists
            ? currentList.filter((item) => item !== index)
            : [...currentList, index],
        },
      }
    })
  }

  function toggleCompleted() {
    setProgress((current) => ({
      ...current,
      completed: current.completed.includes(selectedId)
        ? current.completed.filter((id) => id !== selectedId)
        : [...current.completed, selectedId],
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
    if (window.confirm('Supprimer cette technique personnalisée ?')) {
      setCustomTechniques((prev) => prev.filter((item) => item.id !== id))
      setProgress((current) => ({
        ...current,
        completed: current.completed.filter((itemId) => itemId !== id),
        exercises: Object.fromEntries(
          Object.entries(current.exercises).filter(([key]) => key !== id)
        ),
      }))
      if (selectedId === id) {
        setSelectedId(defaultTechniques[0].id)
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
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>ClayBloom - Techniques de modelage</title>
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
      <p class="subtitle">Guide complet des techniques — ${printableTechniques?.length || 0} techniques • ${new Date().toLocaleDateString('fr-FR')}</p>
    </header>

    ${printableTechniques?.map((tech) => `
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
            <p class="section-title">Objectifs</p>
            <ul>
              ${tech.objectives.map((obj) => `<li>${obj}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${tech.materials?.length ? `
          <div class="section">
            <p class="section-title">Matériel nécessaire</p>
            <ul>
              ${tech.materials.map((mat) => `<li>${mat}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${tech.steps?.length ? `
          <div class="section">
            <p class="section-title">Étapes à suivre</p>
            <ol>
              ${tech.steps.map((step) => `<li>${step}</li>`).join('')}
            </ol>
          </div>
        ` : ''}

        ${tech.exercise?.length ? `
          <div class="section">
            <p class="section-title">Exercices pratiques</p>
            <ul>
              ${tech.exercise.map((ex) => `<li>${ex}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${tech.tip ? `
          <div class="tip">
            <p class="tip-title">Conseil ClayBloom</p>
            <p>${tech.tip}</p>
          </div>
        ` : ''}

        ${tech.mistakes?.length ? `
          <div class="mistakes">
            <p class="mistakes-title">Erreurs à éviter</p>
            <ul>
              ${tech.mistakes.map((mist) => `<li>${mist}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${tech.project ? `
          <div class="project">
            <p class="project-title">Projet final</p>
            <p>${tech.project}</p>
          </div>
        ` : ''}
      </div>
    `).join('') || '<p>Aucune technique à afficher.</p>'}

    <div class="footer">
      <p>Document généré par ClayBloom - L'atelier de modelage créatif</p>
      <p>Progression : ${percentage || 0}% • ${completedCount || 0}/${printableTechniques?.length || 0} techniques terminées</p>
    </div>
  </body>
  </html>
`;


       const printWindow = window.open('', '_blank');

    if (!printWindow) {
      alert("Autorise les fenêtres pop-up pour ClayBloom.");
      return;
    }

    try {
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();

      printWindow.setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.print();
        }
      }, 1000);
    } catch (error) {
      console.error("Erreur d'impression :", error);
      printWindow.close();
      alert("Impossible de préparer le document à imprimer.");
    }
  }

  return (
    <main className="min-h-screen bg-[#fffaf8] pb-16 text-stone-800">
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-rose-100 via-orange-50 to-amber-50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-4 py-2 text-sm font-medium text-rose-700">
              <Sparkles size={16} />
              L'atelier ClayBloom
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-stone-800 sm:text-5xl lg:text-6xl">
              Apprends les
              <span className="block text-rose-500">
                techniques du modelage
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
              Découvre les gestes essentiels, entraîne-toi avec des exercices
              guidés et avance à ton rythme dans ton apprentissage créatif.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => selectTechnique(allTechniques[0].id)}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-6 py-3.5 font-semibold text-white shadow-md shadow-rose-200 transition hover:bg-rose-600"
              >
                Commencer à apprendre
                <ChevronRight size={18} />
              </button>
              
              <button
                type="button"
                onClick={exportToPDF}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-6 py-3.5 font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50"
              >
                <Download size={18} />
                Exporter en PDF
              </button>
              
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-purple-300 bg-white px-6 py-3.5 font-semibold text-purple-700 shadow-sm transition hover:bg-purple-50"
              >
                <Plus size={18} />
                Nouvelle technique
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-white/40 blur-xl" />
            <div className="relative rounded-4xl border border-white/70 bg-white/60 p-5 shadow-xl backdrop-blur sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-stone-500">
                    Ma progression
                  </p>
                  <p className="mt-1 text-3xl font-bold text-stone-800">
                    {percentage}%
                  </p>
                </div>
                <div className="rounded-2xl bg-rose-100 p-4 text-rose-600">
                  <Trophy size={28} />
                </div>
              </div>

              <div
                className="mt-5 h-3 overflow-hidden rounded-full bg-rose-100"
                role="progressbar"
                aria-label="Progression des techniques"
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
                <div className="rounded-2xl bg-white p-4">
                  <BookOpen className="text-rose-500" size={21} />
                  <p className="mt-3 text-2xl font-bold">{completedCount}</p>
                  <p className="mt-1 text-xs text-stone-500">
                    Techniques terminées
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <Target className="text-rose-500" size={21} />
                  <p className="mt-3 text-2xl font-bold">
                    {completedExercises}/{totalExercises}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    Exercices réalisés
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-stone-500">
                Chaque petite étape compte. Reviens à l'atelier pour reprendre
                là où tu t'es arrêté.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bibliothèque */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionTitle
            eyebrow="La bibliothèque"
            title="Explore les techniques"
            description="Choisis un thème, découvre les explications et passe à la pratique."
          />
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-600"
            >
              <Plus size={17} />
              Ajouter
            </button>
            <button
              type="button"
              onClick={exportToPDF}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
            >
              <Download size={17} />
              PDF
            </button>
          </div>
        </div>

        <div className="mb-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_200px_160px_160px_auto]">
          <label className="relative block">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une technique..."
              aria-label="Rechercher une technique"
              className="w-full rounded-xl border border-rose-100 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            />
          </label>

          <label className="relative">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filtrer par catégorie"
              className="w-full appearance-none rounded-xl border border-rose-100 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-rose-300"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
          </label>

          <label className="relative">
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              aria-label="Filtrer par niveau"
              className="w-full appearance-none rounded-xl border border-rose-100 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-rose-300"
            >
              {levels.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
          </label>

          <label className="relative">
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
              aria-label="Filtrer par difficulté"
              className="w-full appearance-none rounded-xl border border-rose-100 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-rose-300"
            >
              {difficulties.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
          </label>

          <button
            type="button"
            onClick={() => setShowCompleted((value) => !value)}
            aria-pressed={showCompleted}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              showCompleted
                ? 'border-rose-400 bg-rose-100 text-rose-700'
                : 'border-rose-100 bg-white text-stone-600 hover:bg-rose-50'
            }`}
          >
            {showCompleted ? 'Voir toutes' : 'Voir les terminées'}
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
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-rose-200 bg-white px-6 py-12 text-center">
            <Search className="mx-auto text-rose-400" size={30} />
            <h3 className="mt-4 font-bold">Aucune technique trouvée</h3>
  <p className="mt-2 text-sm text-stone-500">
  Coche chaque exercice une fois réalisé.
</p>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setCategory('Toutes')
                setLevel('Tous')
                setDifficulty('Tous')
                setShowCompleted(false)
              }}
              className="mt-4 font-semibold text-rose-600 hover:text-rose-700"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </section>

      {/* Atelier interactif */}
      <section
        id="atelier-technique"
        className="scroll-mt-8 border-y border-rose-100 bg-white"
      >
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
          <SectionTitle
            eyebrow="Passons à la pratique"
            title="Mon atelier interactif"
            description="Suis les étapes, réalise les exercices et valide la technique quand tu es prêt."
          />

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="rounded-3xl border border-rose-100 bg-[#fffaf8] p-5 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                  {selected.category}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-600">
                  {selected.level}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-600">
                  {selected.difficulty}
                </span>
                <span className="flex items-center gap-1 text-xs text-stone-500">
                  <Clock size={14} />
                  {selected.duration}
                </span>
                {selected.isCustom && (
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                    Personnalisée
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-2xl font-bold sm:text-3xl">
                {selected.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">
                {selected.description}
              </p>

              <div className="mt-7">
                <h4 className="flex items-center gap-2 font-bold">
                  <Target size={19} className="text-rose-500" />
                  Objectifs
                </h4>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {selected.objectives.map((objective) => (
                    <li
                      key={objective}
                      className="flex items-start gap-2 rounded-xl bg-white p-3 text-sm text-stone-600"
                    >
                      <Check size={16} className="mt-0.5 shrink-0 text-rose-500" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7">
                <h4 className="flex items-center gap-2 font-bold">
                  <Hammer size={19} className="text-rose-500" />
                  Matériel nécessaire
                </h4>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {selected.materials.map((material) => (
                    <li
                      key={material}
                      className="flex items-start gap-2 rounded-xl bg-white p-3 text-sm text-stone-600"
                    >
                      <Check size={16} className="mt-0.5 shrink-0 text-rose-500" />
                      {material}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <h4 className="flex items-center gap-2 font-bold">
                  <BookOpen size={19} className="text-rose-500" />
                  Les étapes à suivre
                </h4>
                <ol className="mt-4 space-y-3">
                  {selected.steps.map((step, index) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                        {index + 1}
                      </span>
                      <p className="pt-1 text-sm leading-6 text-stone-600">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <h4 className="flex items-center gap-2 font-bold text-amber-900">
                  <Lightbulb size={19} />
                  Le conseil ClayBloom
                </h4>
                <p className="mt-2 text-sm leading-6 text-amber-900/80">
                  {selected.tip}
                </p>
              </div>

              <div className="mt-8">
                <h4 className="flex items-center gap-2 font-bold">
                  <Target size={19} className="text-rose-500" />
                  Mon exercice pratique
                </h4>
                <p className="mt-2 text-sm text-stone-500">
                  Coche chaque objectif une fois réalisé.
                </p>

                <div className="mt-4 space-y-3">
                  {selected.exercise.map((task, index) => {
                    const checked = selectedExercises.includes(index)

                    return (
                      <label
                        key={task}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                          checked
                            ? 'border-emerald-200 bg-emerald-50'
                            : 'border-rose-100 bg-white hover:border-rose-200'
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
                              ? 'text-emerald-800'
                              : 'text-stone-700'
                          }`}
                        >
                          {task}
                        </span>
                        {checked && (
                          <CheckCircle2
                            size={18}
                            className="ml-auto mt-0.5 shrink-0 text-emerald-600"
                          />
                        )}
                      </label>
                    )
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-stone-500">
                  <span>Exercices réalisés</span>
                  <span className="font-semibold text-stone-700">
                    {selectedExercises.length}/{selected.exercise.length}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-rose-100">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all"
                    style={{
                      width: `${(selectedExercises.length / selected.exercise.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={toggleCompleted}
                className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 font-semibold transition ${
                  selectedDone
                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-rose-500 text-white hover:bg-rose-600'
                }`}
              >
                {selectedDone ? (
                  <>
                    <CheckCircle2 size={19} />
                    Technique terminée — annuler la validation
                  </>
                ) : (
                  <>
                    <Check size={19} />
                    Marquer cette technique comme terminée
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-stone-400">
                Valide la technique lorsque tu as terminé la pratique. Tu peux
                modifier ton suivi à tout moment.
              </p>
            </div>

            {/* Colonne latérale */}
            <aside className="space-y-5 lg:sticky lg:top-6">
              <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-5">
                <h4 className="font-bold">Ton parcours</h4>
                <p className="mt-1 text-sm text-stone-500">
                  {completedCount} technique(s) sur {allTechniques.length}
                </p>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-rose-400 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <p className="mt-3 text-2xl font-bold text-rose-600">
                  {percentage}%
                </p>

                <div className="mt-5 space-y-2">
                  {allTechniques.map((item) => {
                    const done = progress.completed.includes(item.id)
                    const active = item.id === selectedId

                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => selectTechnique(item.id)}
                        className={`flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm transition ${
                          active
                            ? 'bg-white shadow-sm ring-1 ring-rose-200'
                            : 'hover:bg-white/70'
                        }`}
                      >
                        {done ? (
                          <CheckCircle2
                            size={18}
                            className="shrink-0 text-emerald-600"
                          />
                        ) : (
                          <Circle
                            size={18}
                            className="shrink-0 text-stone-300"
                          />
                        )}
                        <span className="flex-1 font-medium truncate">
                          {item.title}
                        </span>
                        {item.isCustom && (
                          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                            Perso
                          </span>
                        )}
                        {active && (
                          <ChevronRight
                            size={16}
                            className="shrink-0 text-rose-500"
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <h4 className="font-bold">À éviter</h4>
                <ul className="mt-3 space-y-3">
                  {selected.mistakes.map((mistake) => (
                    <li
                      key={mistake}
                      className="flex items-start gap-2 text-sm leading-6 text-stone-600"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <h4 className="font-bold">Gérer ma progression</h4>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Tes validations et exercices sont enregistrés sur cet
                  appareil dans ton navigateur.
                </p>

                {!showResetConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    className="mt-4 flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-rose-600"
                  >
                    <RotateCcw size={16} />
                    Réinitialiser ma progression
                  </button>
                ) : (
                  <div className="mt-4 rounded-xl bg-rose-50 p-3">
                    <p className="text-sm text-stone-700">
                      Effacer toutes les validations et tous les exercices ?
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={resetProgress}
                        className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white"
                      >
                        Confirmer
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowResetConfirm(false)}
                        className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-stone-600"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Conseils */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
        <div className="rounded-3xl bg-linear-to-r from-rose-100 via-orange-50 to-amber-100 p-7 sm:p-10">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="rounded-2xl bg-white p-4 text-rose-500 shadow-sm">
              <Sparkles size={30} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                La créativité se construit avec la pratique
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-600">
                Avance étape par étape, prends le temps d'expérimenter et
                conserve tes essais pour observer tes progrès. Chaque création
                est une occasion d'apprendre.
              </p>
            </div>
            <button
              type="button"
              onClick={() => selectTechnique(allTechniques[0].id)}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50"
            >
              Reprendre l'atelier
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* Modal d'ajout */}
      {showAddModal && (
        <AddTechniqueModal
          onClose={() => setShowAddModal(false)}
          onAdd={addTechnique}
        />
      )}
    </main>
  )
}
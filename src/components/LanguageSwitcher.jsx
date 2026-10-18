
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLanguage = (language) => {
    i18n.changeLanguage(language)
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-pink-200 bg-white/80 p-1 dark:border-[#49364b] dark:bg-[#241e2a]">
      <button
        type="button"
        onClick={() => changeLanguage('fr')}
        aria-pressed={i18n.language.startsWith('fr')}
        className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
          i18n.language.startsWith('fr')
            ? 'bg-pink-500 text-white'
            : 'text-[#806C7A] hover:bg-pink-50 dark:text-[#c0afc4] dark:hover:bg-[#352a43]'
        }`}
      >
        FR
      </button>

      <button
        type="button"
        onClick={() => changeLanguage('en')}
        aria-pressed={i18n.language.startsWith('en')}
        className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
          i18n.language.startsWith('en')
            ? 'bg-pink-500 text-white'
            : 'text-[#806C7A] hover:bg-pink-50 dark:text-[#c0afc4] dark:hover:bg-[#352a43]'
        }`}
      >
        EN
      </button>
    </div>
  )
}

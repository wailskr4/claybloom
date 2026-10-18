
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import fr from './locales/fr/translation.json'
import en from './locales/en/translation.json'

const savedLanguage =
  typeof window !== 'undefined'
    ? localStorage.getItem('claybloom:language') || 'fr'
    : 'fr'

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: savedLanguage,
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (language) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = language
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('claybloom:language', language)
  }
})

export default i18n

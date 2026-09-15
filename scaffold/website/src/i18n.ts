import { Translations } from './types'
import enTranslations from './translations/en.json'
import frTranslations from './translations/fr.json'

let currentLanguage: keyof Translations = 'en'
const translations: Translations = {
  en: enTranslations,
  fr: frTranslations
}

/**
 * Loads translation data for the current app session.
 */
export async function loadTranslations() {
  return Promise.resolve(translations[currentLanguage])
}

/**
 * Sets the active user language.
 */
export function setLanguage(lang: string) {
  currentLanguage = lang === 'fr' ? 'fr' : 'en'
}

/**
 * Resolves a translation key for the active language.
 */
export function t(key: string): string {
  return translations[currentLanguage]?.[key] || key
}

/**
 * Returns the user's active language.
 */
export function getCurrentLanguage() {
  return currentLanguage
}

import 'server-only'
import type { Locale } from './config'

const dictionaries = {
  id: () => import('./dictionaries/id.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
}

export async function getDictionary(locale: Locale) {
  const loader = dictionaries[locale] ?? dictionaries.id
  return loader()
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>


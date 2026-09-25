import { ca } from './ca';
import { en } from './en';
import { es } from './es';

export const LANGS = ['ca', 'en', 'es'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'ca';
export const LANG_NAMES: Record<Lang, string> = { ca: 'Català', en: 'English', es: 'Español' };
export type Dict = typeof ca;
const dicts: Record<Lang, Dict> = { ca, en, es };
export const useT = (lang: Lang): Dict => dicts[lang];

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import enLang from './locales/en/en.json';

export const resources = {
  'en': { translation: enLang, name: "English" }
};

export type TSupportedLanguages = keyof typeof resources;
export const SupportedLanguages = Object.keys(
  resources,
) as (keyof typeof resources)[]; 

const myLocale = getLocales()[0];
const locale = myLocale?.languageCode || 'en';
export const fallbackLng = "en"

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: fallbackLng,
    debug: false,
    lng: locale,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });

export default i18n;
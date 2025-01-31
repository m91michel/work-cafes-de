'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import { language } from '@/libs/environment';

// Don't want to use this?
// Have a look at the Quick start guide 
// for passing in lng and translations on init

const i18nInstance = i18n
  .use(Backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: language, // Use the environment variable to determine language
    fallbackLng: language,
    supportedLngs: ['de', 'en'],
    defaultNS: 'common',
    ns: ['common', 'cafe', 'city'],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: false // This is important for SSR
    }
  });

export default i18n; 
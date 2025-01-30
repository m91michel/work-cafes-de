import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import { isGerman } from '@/libs/environment';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: isGerman ? 'de' : 'en', // Use the environment variable to determine language
    fallbackLng: 'de',
    supportedLngs: ['de', 'en'],
    defaultNS: 'common',
    ns: ['common', 'cafe', 'city'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 
import { useTranslation } from 'react-i18next';
import { isGerman } from '@/libs/environment';

export function useTranslations() {
  const { t, i18n } = useTranslation();

  return {
    t,
    i18n,
    currentLanguage: isGerman ? 'de' : 'en',
    isGerman,
  };
} 
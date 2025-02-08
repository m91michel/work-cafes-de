import { useTranslation as useTranslationBase } from 'react-i18next';
import { isGerman } from '@/libs/environment';

export function useCTranslation(namespace?: string) {
  const { t, i18n } = useTranslationBase(namespace);

  const tHighlight = (key: string, options?: any) => {
    const translated = t(key, options);
    return {
      __html: (translated as string).replace(
        /<highlight>(.*?)<\/highlight>/g,
        (_: string, text: string) => `<span class="gradient-text">${text}</span>`
      )
    };
  };

  return {
    t,
    tHighlight,
    i18n,
    currentLanguage: isGerman ? 'de' : 'en',
    isGerman,
  };
}
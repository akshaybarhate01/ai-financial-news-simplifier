import { useNewsStore } from '../store/newsStore';
import { translations, TranslationKey, Language } from '../utils/translations';

export const useTranslation = () => {
  const { activeLanguage } = useNewsStore();
  const lang: Language = (activeLanguage as Language) || 'en';

  const t = (key: TranslationKey, variables?: Record<string, string | number>): string => {
    const langDict = translations[lang] || translations.en;
    let str = (langDict as any)[key] || (translations.en as any)[key] || key;

    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }

    return str;
  };

  return { t, currentLanguage: lang };
};

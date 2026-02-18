
// RASA UR-Nyarugenge Internationalization Config
// This setup allows for English and Kinyarwanda support

export const languages = {
  en: { name: 'English', flag: '🇺🇸' },
  rw: { name: 'Kinyarwanda', flag: '🇷🇼' }
};

export const defaultLanguage = 'en';

// Future expansion: Integrate with react-i18next or simple translation maps
export const translations = {
  en: {
    welcome: "Showing Christ to Academicians",
    motto: "Salvation, Love, and Work"
  },
  rw: {
    welcome: "Kwerekana Kristo mu banyabwenge",
    motto: "Agakiza, Urukundo, n'Umurimo"
  }
};

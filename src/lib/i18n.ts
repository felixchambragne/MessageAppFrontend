import 'intl-pluralrules';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import en from '../locales/en.json';
import fr from '../locales/fr.json';

const bestLanguageTag = RNLocalize.findBestLanguageTag([
  'en',
  'fr',
])?.languageTag;

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    fr: {
      translation: fr,
    },
  },
  lng: bestLanguageTag || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const resources = {};

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        resources,
        fallbackLng: 'en',
        debug: false, //(process.env.NODE_ENV !== 'production'),
        //lng: 'en',
        interpolation: {
            escapeValue: false
        },
        keySeparator: false,
        nsSeparator: false,
        detection: {
            // order and from where user language should be detected
            order: ['localStorage', 'cookie', 'navigator'],
            lookupCookie: 'i18next',
            lookupLocalStorage: 'i18nextLng',

            // cache user language on
            caches: ['localStorage', 'cookie'],

            cookieSecure: true,

            // optional expire and domain for set cookie
            cookieMinutes: 1000000
        }
    });

export default i18n;

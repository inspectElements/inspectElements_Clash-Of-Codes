import i18n from "i18next";
import { initReactI18next } from "react-i18next";
const resources = {
  en: {
    translation: {
      "transact": "Transact",
      "transfer": "Transfer",
      "loan" : "Loan",
      "trade" : "Trade",
      "hi": "Hi",
      "welcome to": "Welcome to अपनी Bachat",
    },
  },
  hi: {
    translation: {
      "transact": "लेनदेन",
      "transfer": "स्थानांतरण",
      "loan" : "ऋण",
      "trade" : "व्यापार",
      "hi": "नमस्ते",
      "welcome to": "अपनी बचत में आपका स्वागत है",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
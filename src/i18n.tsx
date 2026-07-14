import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    resources: {
      en: {
        translation: {
          "The Newest": "the Newest"
          ,"Women": "Women"
          ,"Men":"Men"
          ,"who are we ?":"who are we ?"
          ,"Min Price (EGP)":"Min Price (EGP)"
          ,"Max Price (EGP)":"Max Price (EGP)"
          ,"Sort By":"Sort By"
          ,"Default":"Default"
          ,"Newest Arrivals":"Newest Arrivals"
          ,"Price: Low to High":"Price: Low to High"
          ,"Price: High to Low":"Price: High to Low"
          ,"Apply":"Apply"
          ,"Reset":"Reset"
          ,"Description":"Description"
          ,"Details":"Details"
          ,"Quantity":"Quantity"
          ,"Categories":"Categories"
          

        }
      },
      ar: {
        translation: {
          "The Newest": "الاجدد"
          ,"Women": "حريمي"
          ,"Men":"رجالي"
          ,"who are we ?":"من نحن ؟"
          ,"Min Price (EGP)":"اقل سعر (جنيه)"
          ,"Max Price (EGP)": "اعلي سعر (جنيه)"
          ,"Sort By":"ترتيب حسب"
          ,"Default":"افتراضي"
          ,"Newest Arrivals":"من الاجدد"
          ,"Price: Low to High":"سعر: اقل الي اعلي"
          ,"Price: High to Low":"سعر: اعلي الي اقل"
          ,"Apply":"ضبط"
          ,"Reset":"اعادة ضبط"
          ,"Description":"وصف"
          ,"Details":"تفاصيل"
          ,"Quantity":"كمية"
          ,"Categories":"الفئات"

        }
      }
    }
  });

export default i18n;
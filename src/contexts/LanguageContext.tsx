import React, { createContext, useState, useEffect } from "react";
import en from "../locales/en.json";
import hi from "../locales/hi.json";

const languages = { en, hi };

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
  translations: typeof en;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  changeLanguage: () => {},
  translations: en
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState(localStorage.getItem("language") || 'en');

    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

    const changeLanguage = (lang: string) => {
        setLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, translations: languages[language] }}>
            {children}
        </LanguageContext.Provider>
    );
};
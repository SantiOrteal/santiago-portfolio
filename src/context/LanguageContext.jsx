import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "santiago-portfolio-language";
const defaultLanguage = "en";

function getInitialLanguage() {
  const savedLanguage = localStorage.getItem(STORAGE_KEY);
  if (savedLanguage === "es-MX" || savedLanguage === "en") return savedLanguage;
  return navigator.language.toLowerCase().startsWith("es") ? "es-MX" : defaultLanguage;
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (nextLanguage) => {
    setLanguageState(nextLanguage);
    localStorage.setItem(STORAGE_KEY, nextLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}

import i18n from "@/utils/i18n";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface LangContextType {
  lang: string;
  setLang: (lang: string) => void;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

  useEffect(() => {
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
  }, [lang]);


  return (
    <LangContext.Provider
      value={{
        lang,
        setLang,
      }}
    >
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) throw new Error("there is error in useLang");
  return context;
};

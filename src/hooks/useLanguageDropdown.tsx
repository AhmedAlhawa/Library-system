// hooks/useLanguageDropdown.tsx
import { useLang } from "./useLang";
import { Globe } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import React from "react";

export const useLanguageDropdown = () => {
  const { lang, setLang } = useLang();

  const languages = [
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
  ];

  const handleChange = (code: string) => setLang(code);

  // Return the ready-to-render dropdown
  const LanguageDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Globe className="cursor-pointer w-5 h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        {languages.map((l) => (
          <DropdownMenuItem
            key={l.code}
            className={`${lang === l.code ? "text-primary font-medium" : ""}`}
            onClick={() => handleChange(l.code)}
          >
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return { lang, setLang, LanguageDropdown };
};

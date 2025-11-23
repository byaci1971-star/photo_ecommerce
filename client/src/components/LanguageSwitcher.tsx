import { useLanguage } from '@/contexts/LanguageContext';
import { languages } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useState } from 'react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Globe className="h-4 w-4" />
        <span className="text-xs uppercase">{language}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-border rounded-lg shadow-lg z-50">
          {(Object.keys(languages) as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                language === lang ? 'bg-purple-50 text-purple-600 font-semibold' : ''
              }`}
            >
              {languages[lang]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

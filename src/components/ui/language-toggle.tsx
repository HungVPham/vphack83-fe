import { useLanguage } from '../../lib/LanguageContext';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  // Language options 
  const languages = [
    { code: 'en', flag: '/usa-flag.png' },
    { code: 'vi', flag: '/vietnam-flag.png' },
  ];

  const toggleLanguage = () => {
    const newLang = language === 'vi' ? 'en' : 'vi';
    setLanguage(newLang);
    console.log(`Language changed to: ${newLang}`);
  };

  const currentLang = languages.find((lang) => lang.code === language);

  return (
    <button
      onClick={toggleLanguage}
      className="w-10 h-10 flex items-center justify-center rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
      aria-label={`Switch to ${language === 'vi' ? 'English' : 'Vietnamese'}`}
    >
      <img src={currentLang?.flag} alt={currentLang?.code} className="w-6 h-6" />
    </button>
  );
};

export default LanguageToggle; 

import React, { useState, useEffect } from 'react';
import { generateLogoImage } from './services/geminiService';
import { LogoStyle, LogoGenerationOptions, GeneratedLogo } from './types';
import StyleCard from './components/StyleCard';

type Language = 'uz' | 'ru' | 'en';

const TRANSLATIONS = {
  uz: {
    nav: { generator: 'Generator', gallery: 'Galereya' },
    hero: {
      title: 'AI bilan',
      titleHighlight: 'Noyob Logotiplar',
      // Fixed syntax error: escaped the apostrophe in 'qo\'ying'
      subtitle: 'G\'oyangizni professional brendga aylantiring. Shunchaki tasvirlang, qolganini AIga qo\'ying.',
    },
    form: {
      styleLabel: '1. Uslub tanlang',
      promptLabel: '2. Brendni tasvirlang',
      placeholder: "Masalan: 'Aura' nomli texnologik startup uchun minimalist logotip, ko'k ranglar...",
      error: 'Iltimos, logotip uchun tavsif yozing.',
      button: 'Logo yaratish',
      generating: 'Tayyorlanmoqda...',
    },
    gallery: {
      title: 'Galereya',
      subtitle: 'Siz yaratgan ajoyib logotiplar',
      clear: 'Tozalash',
      empty: 'Hali hech narsa yo\'q',
      emptyDesc: 'Yuqorida brendingizni tasvirlang va birinchi logotipni yarating.',
    },
    styles: {
      minimalist: 'Minimalist',
      '3d': '3D Render',
      gradient: 'Gradient',
      luxury: 'Premium',
      vintage: 'Retro',
      futuristic: 'Futuristik',
      'hand-drawn': 'Artistik',
    }
  },
  ru: {
    nav: { generator: 'Генератор', gallery: 'Галерея' },
    hero: {
      title: 'Создавайте',
      titleHighlight: 'Уникальные Лого',
      subtitle: 'Превратите свою идею в профессиональный бренд. Просто опишите, а AI сделает магию.',
    },
    form: {
      styleLabel: '1. Выберите стиль',
      promptLabel: '2. Опишите ваш бренд',
      placeholder: "Например: Минималистичный логотип для техно-стартапа 'Aura', синие тона...",
      error: 'Пожалуйста, введите описание логотипа.',
      button: 'Создать логотип',
      generating: 'Создание...',
    },
    gallery: {
      title: 'Галерея',
      subtitle: 'Ваши шедевры, созданные AI',
      clear: 'Очистить',
      empty: 'Здесь пока пусто',
      emptyDesc: 'Опишите свой бренд выше, чтобы создать свой первый логотип.',
    },
    styles: {
      minimalist: 'Минимализм',
      '3d': '3D Рендер',
      gradient: 'Градиент',
      luxury: 'Премиум',
      vintage: 'Ретро',
      futuristic: 'Будущее',
      'hand-drawn': 'Рисунок',
    }
  },
  en: {
    nav: { generator: 'Generator', gallery: 'Gallery' },
    hero: {
      title: 'Design',
      titleHighlight: 'Unique Logos',
      subtitle: 'Transform your vision into a professional brand identity. Just describe it, let AI do the magic.',
    },
    form: {
      styleLabel: '1. Choose a Style',
      promptLabel: '2. Describe your Brand',
      placeholder: "e.g. Minimalist logo for a tech startup called 'Aura' using blue tones...",
      error: 'Please describe your logo.',
      button: 'Generate Logo',
      generating: 'Crafting...',
    },
    gallery: {
      title: 'Design Gallery',
      subtitle: 'Masterpieces created by LogoGenius AI',
      clear: 'Clear All',
      empty: 'Ready to start?',
      emptyDesc: 'Enter a description above to generate your first professional logo.',
    },
    styles: {
      minimalist: 'Minimalist',
      '3d': '3D Render',
      gradient: 'Gradient',
      luxury: 'Luxury',
      vintage: 'Vintage',
      futuristic: 'Sci-Fi',
      'hand-drawn': 'Artistic',
    }
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('uz');
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<LogoStyle>('minimalist');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedLogo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  const STYLES: { id: LogoStyle; icon: string }[] = [
    { id: 'minimalist', icon: 'fa-vector-square' },
    { id: '3d', icon: 'fa-cube' },
    { id: 'gradient', icon: 'fa-fill-drip' },
    { id: 'luxury', icon: 'fa-gem' },
    { id: 'vintage', icon: 'fa-stamp' },
    { id: 'futuristic', icon: 'fa-robot' },
    { id: 'hand-drawn', icon: 'fa-pen-nib' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('logo_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
    const savedLang = localStorage.getItem('app_lang');
    if (savedLang && (savedLang === 'uz' || savedLang === 'ru' || savedLang === 'en')) {
      setLang(savedLang as Language);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('logo_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
  }, [lang]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError(t.form.error);
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const options: LogoGenerationOptions = {
        prompt: prompt,
        style: selectedStyle,
        aspectRatio: '1:1'
      };

      const imageUrl = await generateLogoImage(options);
      
      const newLogo: GeneratedLogo = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: prompt,
        style: selectedStyle,
        createdAt: Date.now()
      };

      setHistory(prev => [newLogo, ...prev]);
      setPrompt('');
      
      setTimeout(() => {
        const element = document.getElementById('gallery');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    } catch (err) {
      setError(lang === 'uz' ? "Xatolik yuz berdi." : lang === 'ru' ? "Произошла ошибка." : "An error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `logo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeLogo = (id: string) => {
    setHistory(prev => prev.filter(logo => logo.id !== id));
  };

  return (
    <div className="min-h-screen pb-12">
      <nav className="sticky top-0 z-50 glass border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-bolt text-white text-xl"></i>
            </div>
            <span className="text-xl font-bold tracking-tight">LogoGenius <span className="text-blue-500">AI</span></span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-6 text-sm font-medium text-slate-400">
              <a href="#generator" onClick={(e) => scrollToSection(e, 'generator')} className="hover:text-white transition">{t.nav.generator}</a>
              <a href="#gallery" onClick={(e) => scrollToSection(e, 'gallery')} className="hover:text-white transition">{t.nav.gallery}</a>
            </div>
            
            <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
              {(['uz', 'ru', 'en'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                    lang === l ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main id="generator" className="container mx-auto px-6 mt-12 scroll-mt-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            {t.hero.title} <span className="gradient-text">{t.hero.titleHighlight}</span> <br /> 
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto glass p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="mb-8">
            <label className="block text-slate-300 text-sm font-bold mb-4 uppercase tracking-widest text-left">{t.form.styleLabel}</label>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
              {STYLES.map(style => (
                <StyleCard 
                  key={style.id} 
                  styleId={style.id} 
                  label={t.styles[style.id]} 
                  icon={style.icon} 
                  isSelected={selectedStyle === style.id} 
                  onSelect={setSelectedStyle} 
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-slate-300 text-sm font-bold mb-4 uppercase tracking-widest text-left">{t.form.promptLabel}</label>
            <div className="relative gradient-border">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.form.placeholder}
                className="w-full bg-slate-900 border-none rounded-xl p-5 text-white placeholder-slate-500 focus:ring-0 min-h-[120px] resize-none"
              />
            </div>
          </div>

          {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">{error}</div>}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-5 rounded-xl font-black text-lg transition-all flex items-center justify-center space-x-3 shadow-xl ${
              isGenerating ? 'bg-slate-700 cursor-not-allowed text-slate-400' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transform hover:-translate-y-1'
            }`}
          >
            {isGenerating ? <><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div><span>{t.form.generating}</span></> : <><i className="fas fa-wand-magic-sparkles"></i><span>{t.form.button}</span></>}
          </button>
        </div>

        {isGenerating && (
          <div className="mt-12 flex flex-col items-center">
             <div className="w-64 h-64 rounded-2xl bg-slate-800 animate-pulse flex items-center justify-center border border-slate-700">
                <i className="fas fa-image text-slate-600 text-4xl"></i>
             </div>
          </div>
        )}

        <div id="gallery" className="scroll-mt-24 mt-20">
          {history.length > 0 ? (
            <div>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-bold">{t.gallery.title}</h2>
                  <p className="text-slate-500">{t.gallery.subtitle}</p>
                </div>
                <button onClick={() => setHistory([])} className="text-slate-500 hover:text-red-400 transition text-sm flex items-center space-x-2">
                  <i className="fas fa-trash-can"></i><span>{t.gallery.clear}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {history.map((logo) => (
                  <div key={logo.id} className="group glass rounded-3xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all duration-500 shadow-xl">
                    <div className="relative aspect-square overflow-hidden bg-slate-900">
                      <img src={logo.url} alt={logo.prompt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-4 p-6">
                        <div className="flex space-x-3">
                          <button onClick={() => handleDownload(logo.url)} className="bg-white text-black p-3 rounded-full hover:bg-blue-400 hover:text-white transition transform hover:scale-110"><i className="fas fa-download"></i></button>
                          <button onClick={() => removeLogo(logo.id)} className="bg-red-500/20 text-red-400 p-3 rounded-full hover:bg-red-500 hover:text-white transition transform hover:scale-110"><i className="fas fa-trash"></i></button>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex justify-between items-center bg-slate-800/30">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">{t.styles[logo.style]}</span>
                      <div className="text-slate-500 text-xs italic">{new Date(logo.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !isGenerating && (
            <div className="mt-20 py-20 flex flex-col items-center justify-center text-center opacity-40">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-palette text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">{t.gallery.empty}</h3>
              <p className="max-w-xs">{t.gallery.emptyDesc}</p>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-800 py-12 text-center text-slate-500">
        <p className="text-sm">&copy; 2025 LogoGenius AI.</p>
      </footer>
    </div>
  );
};

export default App;

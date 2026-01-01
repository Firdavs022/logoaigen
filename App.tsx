
import React, { useState, useCallback, useEffect } from 'react';
import { generateLogoImage } from './services/geminiService';
import { LogoStyle, LogoGenerationOptions, GeneratedLogo } from './types';
import StyleCard from './components/StyleCard';

const STYLES: { id: LogoStyle; label: string; icon: string }[] = [
  { id: 'minimalist', label: 'Minimalist', icon: 'fa-vector-square' },
  { id: '3d', label: '3D Render', icon: 'fa-cube' },
  { id: 'gradient', label: 'Gradient', icon: 'fa-fill-drip' },
  { id: 'luxury', label: 'Luxury', icon: 'fa-gem' },
  { id: 'vintage', label: 'Vintage', icon: 'fa-stamp' },
  { id: 'futuristic', label: 'Sci-Fi', icon: 'fa-robot' },
  { id: 'hand-drawn', label: 'Artistic', icon: 'fa-pen-nib' },
];

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<LogoStyle>('minimalist');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedLogo[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('logo_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem('logo_history', JSON.stringify(history));
  }, [history]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please describe your logo first.");
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
      setPrompt(''); // Clear prompt for next one
      
      // Auto scroll to gallery after generation
      setTimeout(() => {
        const element = document.getElementById('gallery');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    } catch (err) {
      setError("Failed to generate logo. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `logo-${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeLogo = (id: string) => {
    setHistory(prev => prev.filter(logo => logo.id !== id));
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-bolt text-white text-xl"></i>
            </div>
            <span className="text-xl font-bold tracking-tight">LogoGenius <span className="text-blue-500">AI</span></span>
          </div>
          <div className="flex space-x-8 text-sm font-medium text-slate-400">
            <a 
              href="#generator" 
              onClick={(e) => scrollToSection(e, 'generator')}
              className="hover:text-white transition"
            >
              Generator
            </a>
            <a 
              href="#gallery" 
              onClick={(e) => scrollToSection(e, 'gallery')}
              className="hover:text-white transition"
            >
              Gallery
            </a>
          </div>
          <div className="hidden md:block">
             <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">FREE</span>
          </div>
        </div>
      </nav>

      {/* Hero / Generator Section */}
      <main id="generator" className="container mx-auto px-6 mt-12 scroll-mt-24">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Design <span className="gradient-text">Unique Logos</span> <br /> 
            in Seconds with AI
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Transform your vision into a professional brand identity. Just describe what you want, and let our advanced AI do the magic.
          </p>
        </div>

        <div className="max-w-4xl mx-auto glass p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Style Selection */}
          <div className="mb-8">
            <label className="block text-slate-300 text-sm font-bold mb-4 uppercase tracking-widest text-left">
              1. Choose a Style
            </label>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
              {STYLES.map(style => (
                <StyleCard
                  key={style.id}
                  styleId={style.id}
                  label={style.label}
                  icon={style.icon}
                  isSelected={selectedStyle === style.id}
                  onSelect={setSelectedStyle}
                />
              ))}
            </div>
          </div>

          {/* Prompt Area */}
          <div className="mb-8">
            <label className="block text-slate-300 text-sm font-bold mb-4 uppercase tracking-widest text-left">
              2. Describe your Brand
            </label>
            <div className="relative gradient-border">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A minimalist logo for a tech startup called 'Aura' using electric blue tones and geometric shapes..."
                className="w-full bg-slate-900 border-none rounded-xl p-5 text-white placeholder-slate-500 focus:ring-0 min-h-[120px] resize-none"
              />
              <div className="absolute bottom-4 right-4 text-xs text-slate-500">
                {prompt.length} characters
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-5 rounded-xl font-black text-lg transition-all flex items-center justify-center space-x-3 shadow-xl ${
              isGenerating 
                ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transform hover:-translate-y-1 active:translate-y-0'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Crafting Your Logo...</span>
              </>
            ) : (
              <>
                <i className="fas fa-wand-magic-sparkles"></i>
                <span>Generate Logo Identity</span>
              </>
            )}
          </button>
        </div>

        {/* Display Current Result or Latest */}
        {isGenerating && (
          <div className="mt-12 flex flex-col items-center">
             <div className="w-64 h-64 rounded-2xl bg-slate-800 animate-pulse flex items-center justify-center border border-slate-700">
                <i className="fas fa-image text-slate-600 text-4xl"></i>
             </div>
             <p className="mt-4 text-slate-400 animate-bounce">Thinking...</p>
          </div>
        )}

        {/* History / Gallery Section */}
        <div id="gallery" className="scroll-mt-24">
          {history.length > 0 ? (
            <div className="mt-20">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-bold">Your Design Gallery</h2>
                  <p className="text-slate-500">Recent masterpieces created by LogoGenius AI</p>
                </div>
                <button 
                  onClick={() => setHistory([])}
                  className="text-slate-500 hover:text-red-400 transition flex items-center space-x-2 text-sm"
                >
                  <i className="fas fa-trash-can"></i>
                  <span>Clear All</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {history.map((logo) => (
                  <div key={logo.id} className="group glass rounded-3xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all duration-500 shadow-xl">
                    <div className="relative aspect-square overflow-hidden bg-slate-900">
                      <img 
                        src={logo.url} 
                        alt={logo.prompt} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-4 p-6 text-center">
                        <p className="text-xs text-slate-300 line-clamp-3 mb-2">"{logo.prompt}"</p>
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => handleDownload(logo.url, logo.prompt)}
                            className="bg-white text-black p-3 rounded-full hover:bg-blue-400 hover:text-white transition transform hover:scale-110"
                            title="Download"
                          >
                            <i className="fas fa-download"></i>
                          </button>
                          <button 
                            onClick={() => removeLogo(logo.id)}
                            className="bg-red-500/20 text-red-400 p-3 rounded-full hover:bg-red-500 hover:text-white transition transform hover:scale-110"
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex justify-between items-center bg-slate-800/30">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1 block">
                          {logo.style}
                        </span>
                        <h3 className="font-semibold text-slate-200 truncate max-w-[150px]">
                          {logo.prompt.substring(0, 30)}...
                        </h3>
                      </div>
                      <div className="text-slate-500 text-xs italic">
                        {new Date(logo.createdAt).toLocaleDateString()}
                      </div>
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
              <h3 className="text-xl font-bold mb-2">Ready to start?</h3>
              <p className="max-w-xs">Enter a description above to generate your first professional logo.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-800 py-12 text-center text-slate-500">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center space-y-4">
             <div className="flex items-center space-x-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition">
              <div className="w-6 h-6 bg-gradient-to-tr from-blue-600 to-purple-600 rounded flex items-center justify-center">
                <i className="fas fa-bolt text-white text-[10px]"></i>
              </div>
              <span className="text-sm font-bold tracking-tight">LogoGeniusAI</span>
            </div>
            <p className="text-sm">&copy; 2025 LogoGeniusAI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

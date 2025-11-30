import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { ExploreView } from './components/ExploreView';
import { SenseView } from './components/SenseView';
import { VisionView } from './components/VisionView';
import { ChatView } from './components/ChatView';
import { identifyNationalAnimal } from './services/geminiService';
import { ViewMode, NationData, AnimalProfile } from './types';
import { INITIAL_SUGGESTIONS } from './constants';
import { Search, MapPin } from 'lucide-react';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.EXPLORE);
  const [nationData, setNationData] = useState<NationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (countryName: string) => {
    if (!countryName.trim()) return;
    
    setLoading(true);
    setError(null);
    setNationData(null);
    
    try {
      const animalData = await identifyNationalAnimal(countryName);
      setNationData({
        country: countryName,
        animal: animalData,
        isLoading: false
      });
      setViewMode(ViewMode.EXPLORE);
    } catch (err) {
      setError("Could not locate that nation in the spiritual archives. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-mystic-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-mystic-accent font-serif tracking-widest animate-pulse">CONSULTING THE ARCHIVES...</p>
        </div>
      );
    }

    if (error) {
        return (
            <div className="text-center p-12 bg-red-900/10 border border-red-900 rounded-lg max-w-md mx-auto mt-12">
                <p className="text-red-400 font-serif">{error}</p>
            </div>
        );
    }

    if (!nationData || !nationData.animal) {
      return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {INITIAL_SUGGESTIONS.map(country => (
                    <button
                        key={country}
                        onClick={() => {
                            setQuery(country);
                            handleSearch(country);
                        }}
                        className="p-6 bg-mystic-800 border border-mystic-700 rounded-lg hover:border-mystic-accent hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all group text-left"
                    >
                        <MapPin className="text-mystic-600 group-hover:text-mystic-accent mb-3 transition-colors" />
                        <span className="text-lg font-serif text-gray-300 group-hover:text-white block">{country}</span>
                    </button>
                ))}
            </div>
        </div>
      );
    }

    switch (viewMode) {
      case ViewMode.EXPLORE:
        return <ExploreView country={nationData.country} animal={nationData.animal} />;
      case ViewMode.SENSE:
        return <SenseView country={nationData.country} animal={nationData.animal} />;
      case ViewMode.VISION:
        return <VisionView country={nationData.country} animal={nationData.animal} />;
      case ViewMode.CHAT:
        return <ChatView country={nationData.country} animal={nationData.animal} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-mystic-900 text-gray-200 font-sans selection:bg-mystic-accent selection:text-black">
      {/* Header */}
      <header className="relative overflow-hidden bg-mystic-900 pt-10 pb-6 text-center border-b border-mystic-800">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mystic-900 via-mystic-accent to-mystic-900 opacity-50"></div>
        <h1 className="text-4xl md:text-5xl font-serif text-white tracking-widest mb-2">NATION<span className="text-mystic-accent">SENSE</span></h1>
        <p className="text-sm text-gray-500 font-serif tracking-[0.2em] uppercase mb-8">Animals are the 6th sense of a nation</p>

        <div className="max-w-xl mx-auto px-6 relative z-10">
            <div className="relative group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                    placeholder="Enter a Nation (e.g., Japan, Canada)..."
                    className="w-full bg-mystic-800/80 border border-mystic-700 text-white px-6 py-4 rounded-full pl-14 focus:outline-none focus:border-mystic-accent focus:bg-mystic-800 transition-all shadow-lg backdrop-blur-sm"
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-mystic-accent transition-colors" size={20} />
                <button 
                    onClick={() => handleSearch(query)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-mystic-700 hover:bg-mystic-accent hover:text-black text-gray-300 px-4 py-2 rounded-full text-xs font-bold transition-all"
                >
                    DISCOVER
                </button>
            </div>
        </div>
      </header>

      {/* Navigation (Only show if data exists) */}
      <Navigation 
        currentMode={viewMode} 
        onModeChange={setViewMode} 
        disabled={!nationData || loading}
      />

      {/* Main Content Area */}
      <main className="min-h-[600px]">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 text-xs font-serif border-t border-mystic-800 mt-12 bg-mystic-900">
        <p>Powered by Gemini 2.5 • The Sixth Sense Project</p>
      </footer>
    </div>
  );
};

export default App;
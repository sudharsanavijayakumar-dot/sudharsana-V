import React, { useState } from 'react';
import { AnimalProfile } from '../types';
import { generateAnimalVision } from '../services/geminiService';
import { Eye, Download } from 'lucide-react';

interface VisionViewProps {
  country: string;
  animal: AnimalProfile;
}

export const VisionView: React.FC<VisionViewProps> = ({ country, animal }) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const base64 = await generateAnimalVision(country, animal.name);
      setGeneratedImage(base64);
    } catch (e) {
      setError("The vision could not be manifested. The ethereal plane is busy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 flex flex-col items-center animate-fade-in">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-serif text-white mb-2">Manifest the Spirit Vision</h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
                Ask the AI to visualize the spiritual essence of the {animal.name} in {country}.
            </p>
        </div>

        {generatedImage ? (
            <div className="relative group rounded-xl overflow-hidden shadow-2xl border-2 border-mystic-accent/30 max-w-lg w-full">
                <img src={generatedImage} alt="Generated Vision" className="w-full h-auto" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                     <a 
                        href={generatedImage} 
                        download={`spirit-${animal.name}.png`}
                        className="p-3 bg-mystic-accent text-black rounded-full hover:bg-white transition-colors"
                        title="Download Vision"
                     >
                        <Download size={24} />
                     </a>
                     <button 
                        onClick={() => setGeneratedImage(null)}
                        className="px-4 py-2 bg-mystic-800 text-white rounded-full border border-mystic-600 hover:bg-mystic-700"
                     >
                        Reset Vision
                     </button>
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center">
                 <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="relative group overflow-hidden px-8 py-4 bg-mystic-900 border border-mystic-accent rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="absolute inset-0 w-full h-full bg-mystic-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                    <div className="relative flex items-center gap-3 text-mystic-accent font-serif text-lg tracking-widest">
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                MANIFESTING...
                            </>
                        ) : (
                            <>
                                <Eye className="w-5 h-5" />
                                REVEAL VISION
                            </>
                        )}
                    </div>
                </button>
                {error && <p className="mt-4 text-red-400 text-sm animate-pulse">{error}</p>}
                
                {!loading && (
                    <div className="mt-12 opacity-30 blur-[1px]">
                         <Eye size={120} className="text-mystic-700" />
                    </div>
                )}
            </div>
        )}
    </div>
  );
};
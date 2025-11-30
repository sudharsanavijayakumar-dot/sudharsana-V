import React, { useEffect, useState } from 'react';
import { AnimalProfile } from '../types';
import { getSixthSenseInsight } from '../services/geminiService';
import { Sparkles } from 'lucide-react';

interface SenseViewProps {
  country: string;
  animal: AnimalProfile;
}

export const SenseView: React.FC<SenseViewProps> = ({ country, animal }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchInsight = async () => {
      if (animal.culturalSignificance) {
        setInsight(animal.culturalSignificance);
        return;
      }

      setLoading(true);
      try {
        const text = await getSixthSenseInsight(country, animal.name);
        if (mounted) setInsight(text);
      } catch (e) {
        if (mounted) setInsight("The connection is clouded. Try again later.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchInsight();
    return () => { mounted = false; };
  }, [country, animal]);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 min-h-[50vh] flex flex-col items-center justify-center animate-fade-in relative">
        <div className="absolute inset-0 bg-mystic-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <h2 className="text-3xl font-serif text-mystic-accent mb-8 text-center flex items-center gap-3">
            <Sparkles className="animate-pulse-slow" />
            The Sixth Sense of {country}
            <Sparkles className="animate-pulse-slow" />
        </h2>

        {loading ? (
            <div className="space-y-4 w-full text-center">
                <div className="w-16 h-16 border-4 border-mystic-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-400 font-serif italic animate-pulse">Communing with the spirit of the {animal.name}...</p>
            </div>
        ) : (
            <div className="prose prose-invert lg:prose-xl text-center relative z-10">
                <p className="font-serif leading-loose text-gray-200">
                    "{insight}"
                </p>
                <div className="mt-8 w-24 h-1 bg-gradient-to-r from-transparent via-mystic-accent to-transparent mx-auto opacity-50"></div>
            </div>
        )}
    </div>
  );
};
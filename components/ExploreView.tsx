import React from 'react';
import { AnimalProfile } from '../types';
import { PLACEHOLDER_IMAGE } from '../constants';

interface ExploreViewProps {
  country: string;
  animal: AnimalProfile;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ country, animal }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Image Card */}
        <div className="relative group overflow-hidden rounded-xl shadow-2xl border border-mystic-700 bg-mystic-800">
            <div className="absolute inset-0 bg-gradient-to-t from-mystic-900 to-transparent opacity-60 z-10"></div>
            <img 
                src={animal.imageUrl || PLACEHOLDER_IMAGE} 
                alt={animal.name}
                className="w-full h-80 md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110 grayscale hover:grayscale-0"
            />
            <div className="absolute bottom-0 left-0 p-6 z-20">
                <h2 className="text-4xl font-serif text-white mb-1">{animal.name}</h2>
                <p className="text-mystic-accent italic text-lg">{animal.scientificName}</p>
            </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-gray-300 font-sans leading-relaxed">
            <div className="bg-mystic-800/50 p-6 rounded-lg border-l-4 border-mystic-accent">
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest text-xs">Habitat</h3>
                <p>{animal.habitat}</p>
            </div>

            <div className="bg-mystic-800/50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest text-xs">Physical Form</h3>
                <p>{animal.description}</p>
            </div>

            <div>
                <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-widest text-xs">Core Traits</h3>
                <div className="flex flex-wrap gap-2">
                    {animal.traits?.map((trait, idx) => (
                        <span key={idx} className="px-3 py-1 bg-mystic-700 text-mystic-accent rounded-full text-sm font-semibold border border-mystic-600">
                            {trait}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
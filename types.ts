export interface AnimalProfile {
  name: string;
  scientificName?: string;
  description: string;
  culturalSignificance?: string; // The "Sixth Sense"
  imageUrl?: string;
  habitat?: string;
  traits?: string[];
}

export interface NationData {
  country: string;
  animal: AnimalProfile | null;
  isLoading: boolean;
  error?: string;
}

export enum ViewMode {
  EXPLORE = 'EXPLORE',
  SENSE = 'SENSE', // The mystic/cultural connection
  VISION = 'VISION', // Image generation
  CHAT = 'CHAT' // Chat with the "Spirit"
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

import { create } from 'zustand';
import { Narrative } from '../types/narrative';
import { echoesOfLisboa } from '../data/demo';

export interface NarrativeState {
  narrative: Narrative | null;
  selectedEpisodeId: string | null;
  composerDraft: string;
  loadDemo: () => void;
  selectEpisode: (episodeId: string | null) => void;
  updateComposerDraft: (text: string) => void;
}

export const useNarrativeStore = create<NarrativeState>((set) => ({
  narrative: null,
  selectedEpisodeId: null,
  composerDraft: '',
  loadDemo: () =>
    set(() => ({
      narrative: echoesOfLisboa,
      selectedEpisodeId: echoesOfLisboa.episodes[0]?.id ?? null,
      composerDraft: ''
    })),
  selectEpisode: (episodeId) => set(() => ({ selectedEpisodeId: episodeId })),
  updateComposerDraft: (text) => set(() => ({ composerDraft: text }))
}));

import { useMemo } from 'react';
import { useNarrativeStore } from '../store/narrativeStore';

export const useComposerSuggestions = () => {
  const narrative = useNarrativeStore((state) => state.narrative);
  const selectedEpisodeId = useNarrativeStore((state) => state.selectedEpisodeId);

  return useMemo(() => {
    if (!narrative) return [] as string[];
    const episode = narrative.episodes.find((ep) => ep.id === selectedEpisodeId);
    if (!episode) return [];
    return episode.beats.map((beat, index) => `Beat ${index + 1}: ${beat}`);
  }, [narrative, selectedEpisodeId]);
};

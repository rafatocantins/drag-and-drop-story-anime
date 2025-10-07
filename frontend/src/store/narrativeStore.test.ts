import { describe, it, expect, beforeEach } from 'vitest';
import { useNarrativeStore } from './narrativeStore';

describe('narrative store', () => {
  beforeEach(() => {
    useNarrativeStore.setState({ narrative: null, selectedEpisodeId: null, composerDraft: '' });
  });

  it('loads demo narrative and selects first episode', () => {
    const loadDemo = useNarrativeStore.getState().loadDemo;
    loadDemo();

    const state = useNarrativeStore.getState();
    expect(state.narrative?.title).toBe('Echoes of Lisboa');
    expect(state.selectedEpisodeId).toBe(state.narrative?.episodes[0]?.id);
  });

  it('updates composer draft', () => {
    const updateComposerDraft = useNarrativeStore.getState().updateComposerDraft;
    updateComposerDraft('New draft');
    expect(useNarrativeStore.getState().composerDraft).toBe('New draft');
  });
});

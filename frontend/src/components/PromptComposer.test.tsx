import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PromptComposer from './PromptComposer';
import { useNarrativeStore } from '../store/narrativeStore';

describe('PromptComposer', () => {
  it('autofills beats into editor draft', () => {
    useNarrativeStore.getState().loadDemo();
    render(<PromptComposer />);

    const autofillButton = screen.getByRole('button', { name: /autofill beats/i });
    fireEvent.click(autofillButton);

    expect(useNarrativeStore.getState().composerDraft).toContain('Beat 1');
  });
});

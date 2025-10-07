import React from 'react';
import Editor from '@monaco-editor/react';
import { useNarrativeStore } from '../store/narrativeStore';
import { useComposerSuggestions } from '../hooks/useComposerSuggestions';

const PromptComposer: React.FC = () => {
  const composerDraft = useNarrativeStore((state) => state.composerDraft);
  const updateComposerDraft = useNarrativeStore((state) => state.updateComposerDraft);
  const suggestions = useComposerSuggestions();

  return (
    <div className="flex h-[420px] flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-brand-200">AI Composer</p>
          <h2 className="text-lg font-semibold text-brand-50">Prompt Workspace</h2>
        </div>
        <button
          type="button"
          className="rounded-md bg-brand-500 px-3 py-1 text-sm font-medium text-white shadow hover:bg-brand-600"
          onClick={() => updateComposerDraft(suggestions.join('\n'))}
        >
          Autofill beats
        </button>
      </header>
      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
        <div className="col-span-2 overflow-hidden rounded-lg border border-slate-800">
          <Editor
            height="100%"
            defaultLanguage="markdown"
            theme="vs-dark"
            value={composerDraft}
            onChange={(value) => updateComposerDraft(value ?? '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on'
            }}
          />
        </div>
        <aside className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-200">
            Narrative Beats
          </h3>
          <ul className="space-y-2 text-slate-200">
            {suggestions.length === 0 && <li className="text-slate-500">Select an episode to view beats.</li>}
            {suggestions.map((suggestion) => (
              <li key={suggestion} className="rounded bg-slate-800/60 p-2">
                {suggestion}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default PromptComposer;

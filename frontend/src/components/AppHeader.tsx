import React from 'react';
import { useNarrativeStore } from '../store/narrativeStore';

const AppHeader: React.FC = () => {
  const narrative = useNarrativeStore((state) => state.narrative);
  const loadDemo = useNarrativeStore((state) => state.loadDemo);

  return (
    <header className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950 p-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-brand-200">Story Studio</p>
        <h1 className="text-3xl font-bold text-brand-50">{narrative?.title ?? 'Echoes Studio'}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          {narrative?.logline ??
            'Load the Echoes of Lisboa demo to explore branching narrative tools for episodic storytelling.'}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs uppercase tracking-wide text-brand-200">
          {narrative?.status ?? 'Demo ready'}
        </span>
        <button
          type="button"
          className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-600"
          onClick={loadDemo}
        >
          Load “Echoes of Lisboa”
        </button>
      </div>
    </header>
  );
};

export default AppHeader;

import React from 'react';
import { useNarrativeStore } from '../store/narrativeStore';

const CharacterList: React.FC = () => {
  const narrative = useNarrativeStore((state) => state.narrative);

  if (!narrative) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-400">
        Load a narrative to review the cast.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-200">Characters</h2>
      <ul className="mt-3 space-y-3">
        {narrative.characters.map((character) => (
          <li key={character.id} className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
            <p className="text-xs uppercase text-brand-300">{character.archetype}</p>
            <p className="text-base font-semibold text-brand-50">{character.name}</p>
            <p className="mt-1 text-sm text-slate-300">{character.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CharacterList;

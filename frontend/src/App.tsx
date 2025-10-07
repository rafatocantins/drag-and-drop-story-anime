import React, { useEffect } from 'react';
import AppHeader from './components/AppHeader';
import NarrativeFlow from './components/NarrativeFlow';
import PromptComposer from './components/PromptComposer';
import CharacterList from './components/CharacterList';
import EngagementPanel from './components/EngagementPanel';
import PollBoard from './components/PollBoard';
import { useNarrativeStore } from './store/narrativeStore';

const App: React.FC = () => {
  const narrative = useNarrativeStore((state) => state.narrative);
  const loadDemo = useNarrativeStore((state) => state.loadDemo);

  useEffect(() => {
    if (!narrative) {
      loadDemo();
    }
  }, [narrative, loadDemo]);

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 p-6">
      <AppHeader />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-6">
          <NarrativeFlow />
          <PromptComposer />
        </div>
        <div className="flex flex-col gap-6">
          <CharacterList />
          <PollBoard />
          <EngagementPanel />
        </div>
      </div>
    </div>
  );
};

export default App;

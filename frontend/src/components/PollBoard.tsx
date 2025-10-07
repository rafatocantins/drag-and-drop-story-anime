import React from 'react';
import { useNarrativeStore } from '../store/narrativeStore';

const PollBoard: React.FC = () => {
  const polls = useNarrativeStore((state) => state.narrative?.polls ?? []);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-200">Community Polls</h2>
      <div className="mt-4 space-y-4">
        {polls.length === 0 && <p className="text-slate-500">No polls yet.</p>}
        {polls.map((poll) => {
          const total = poll.options.reduce((sum, option) => sum + option.votes, 0);
          return (
            <div key={poll.id} className="space-y-2">
              <h3 className="font-semibold text-brand-50">{poll.question}</h3>
              <ul className="space-y-2">
                {poll.options.map((option) => {
                  const percent = total === 0 ? 0 : Math.round((option.votes / total) * 100);
                  return (
                    <li key={option.id} className="rounded-md border border-slate-800 bg-slate-900/70 p-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{option.label}</span>
                        <span className="text-brand-200">{percent}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-800">
                        <div
                          className="h-2 rounded-full bg-brand-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollBoard;

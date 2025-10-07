import React from 'react';
import { useNarrativeStore } from '../store/narrativeStore';

const EngagementPanel: React.FC = () => {
  const engagements = useNarrativeStore((state) => state.narrative?.engagements ?? []);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-200">Engagement</h2>
      <ul className="mt-3 space-y-2 text-sm text-slate-200">
        {engagements.length === 0 && <li className="text-slate-500">No engagement yet.</li>}
        {engagements.map((metric) => (
          <li key={metric.id} className="flex items-center justify-between rounded-md bg-slate-900/60 px-3 py-2">
            <div>
              <p className="font-semibold capitalize text-brand-100">{metric.channel}</p>
              <p className="text-xs text-slate-400">
                {new Date(metric.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase text-slate-400">Impressions</p>
              <p className="font-semibold text-brand-50">{metric.impressions.toLocaleString()}</p>
              <p className="text-xs uppercase text-slate-400">Clicks</p>
              <p className="font-semibold text-brand-50">{metric.clicks.toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EngagementPanel;

import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { useNarrativeStore } from '../store/narrativeStore';

const NarrativeFlow: React.FC = () => {
  const narrative = useNarrativeStore((state) => state.narrative);
  const selectedEpisodeId = useNarrativeStore((state) => state.selectedEpisodeId);
  const selectEpisode = useNarrativeStore((state) => state.selectEpisode);

  const { nodes, edges } = useMemo(() => {
    if (!narrative) return { nodes: [] as Node[], edges: [] as Edge[] };

    const nodes: Node[] = narrative.episodes.map((episode, index) => ({
      id: episode.id,
      position: { x: index * 260, y: 0 },
      data: {
        label: (
          <button
            type="button"
            onClick={() => selectEpisode(episode.id)}
            className={`rounded-lg border p-4 text-left shadow transition ${
              selectedEpisodeId === episode.id
                ? 'border-brand-500 bg-brand-500/10'
                : 'border-slate-700 bg-slate-900/60 hover:border-brand-500'
            }`}
          >
            <p className="text-sm uppercase tracking-wide text-brand-100">Episode</p>
            <h3 className="text-lg font-semibold text-brand-50">{episode.title}</h3>
            <p className="mt-2 text-xs text-slate-300">{episode.summary}</p>
          </button>
        )
      },
      style: { width: 240 }
    }));

    const edges: Edge[] = narrative.episodes.slice(1).map((episode, index) => ({
      id: `${narrative.episodes[index].id}-${episode.id}`,
      source: narrative.episodes[index].id,
      target: episode.id,
      animated: true,
      label: `Beat ${index + 1}`,
      style: { stroke: '#4f46e5' }
    }));

    return { nodes, edges };
  }, [narrative, selectEpisode, selectedEpisodeId]);

  if (!narrative) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        Load a narrative to visualize arcs.
      </div>
    );
  }

  return (
    <div className="h-[420px] w-full rounded-xl border border-slate-800 bg-slate-950">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background gap={24} color="#334155" variant="dots" />
      </ReactFlow>
    </div>
  );
};

export default NarrativeFlow;

import { Narrative, Episode } from '@prisma/client';

interface PromptContext {
  narrative: Narrative & { episodes: Episode[] };
  focusEpisode?: Episode;
  tone?: 'cinematic' | 'investigative' | 'playful';
}

export function buildNarrativePrompt({ narrative, focusEpisode, tone = 'cinematic' }: PromptContext) {
  const toneMap: Record<string, string> = {
    cinematic: 'Write with sweeping, sensory-rich detail to immerse the audience in Lisbon.',
    investigative: 'Emphasize questions, evidence, and community participation like a true docu-series.',
    playful: 'Lean into whimsy and the city’s folklore to delight younger audiences.'
  };

  const beats = focusEpisode?.beats as unknown as string[] | undefined;
  return [
    `Title: ${narrative.title}`,
    `Logline: ${narrative.logline}`,
    `Tone: ${toneMap[tone]}`,
    focusEpisode
      ? `Focus Episode: ${focusEpisode.title} — ${focusEpisode.summary}`
      : 'Focus Episode: Use the overarching narrative threads.',
    '',
    'Episode Beats:',
    ...(beats?.map((beat, index) => `${index + 1}. ${beat}`) ?? ['1. Introduce a new Lisbon memory revealed by Inês.']),
    '',
    'Deliver a 300-word script draft with a cliffhanger prompting a community poll.'
  ].join('\n');
}

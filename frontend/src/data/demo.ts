import { Narrative } from '../types/narrative';

export const echoesOfLisboa: Narrative = {
  id: 'echoes-of-lisboa',
  title: 'Echoes of Lisboa',
  logline:
    'A time-bending fado singer channels the memories of old Lisbon to rally a divided city.',
  status: 'draft',
  characters: [
    {
      id: 'ines',
      name: 'Inês Duarte',
      archetype: 'Reluctant Oracle',
      description:
        'A modern fado singer who can hear the unresolved stories of the Alfama whenever she performs.'
    },
    {
      id: 'tiago',
      name: 'Tiago Carminho',
      archetype: 'Idealistic Producer',
      description:
        'A podcast producer chronicling Lisbon’s transformation who partners with Inês to share her visions.'
    },
    {
      id: 'maria',
      name: 'Maria das Ondas',
      archetype: 'Temporal Guide',
      description:
        'A mythical figure from the Tagus river who appears to keep history from repeating itself.'
    }
  ],
  episodes: [
    {
      id: 'episode-1',
      title: 'Vibrations on Rua da Saudade',
      summary:
        'Inês uncovers a forgotten protest ballad whose lyrics reveal a hidden message for the present day.',
      beats: [
        'Cold open with archival footage blending into Inês’ performance',
        'First vision of 1974 revolution night',
        'Audience poll to decide where the investigation goes next'
      ]
    },
    {
      id: 'episode-2',
      title: 'The Cartographer’s Echo',
      summary:
        'A street artist’s mural sends Inês and Tiago across the city hunting for a pattern of resistance.',
      beats: [
        'Mapping clues on the studio wall',
        'Guest interview with an urban historian',
        'Fork in the story determined by community vote'
      ]
    }
  ],
  polls: [
    {
      id: 'poll-1',
      question: 'Which memory should Inês follow next?',
      options: [
        { id: 'option-a', label: 'The river-side apparition', votes: 184 },
        { id: 'option-b', label: 'The unanswered radio call', votes: 231 },
        { id: 'option-c', label: 'The secret graffiti cipher', votes: 197 }
      ]
    }
  ],
  engagements: [
    {
      id: 'eng-1',
      channel: 'instagram',
      impressions: 13450,
      clicks: 890,
      createdAt: new Date().toISOString()
    },
    {
      id: 'eng-2',
      channel: 'facebook',
      impressions: 8450,
      clicks: 420,
      createdAt: new Date().toISOString()
    }
  ]
};

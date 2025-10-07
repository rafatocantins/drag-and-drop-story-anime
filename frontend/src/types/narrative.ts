export interface Character {
  id: string;
  name: string;
  archetype: string;
  description: string;
}

export interface Episode {
  id: string;
  title: string;
  summary: string;
  publishedAt?: string;
  beats: string[];
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
}

export interface EngagementMetric {
  id: string;
  channel: 'instagram' | 'facebook' | 'tiktok' | 'youtube';
  impressions: number;
  clicks: number;
  createdAt: string;
}

export interface Narrative {
  id: string;
  title: string;
  logline: string;
  status: 'draft' | 'scheduled' | 'live' | 'archived';
  characters: Character[];
  episodes: Episode[];
  polls: Poll[];
  engagements: EngagementMetric[];
}

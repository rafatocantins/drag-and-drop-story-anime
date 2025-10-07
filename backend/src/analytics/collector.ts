import { prisma } from '../config/prisma';

export interface AnalyticsEvent {
  narrativeId: string;
  channel: 'instagram' | 'facebook' | 'tiktok' | 'youtube';
  impressions: number;
  clicks: number;
}

export async function recordAnalyticsEvent(event: AnalyticsEvent) {
  return prisma.engagement.create({
    data: {
      narrativeId: event.narrativeId,
      channel: event.channel,
      impressions: event.impressions,
      clicks: event.clicks
    }
  });
}

export async function getAnalyticsSummary(narrativeId: string) {
  const engagements = await prisma.engagement.findMany({ where: { narrativeId } });
  const totalImpressions = engagements.reduce((sum, item) => sum + item.impressions, 0);
  const totalClicks = engagements.reduce((sum, item) => sum + item.clicks, 0);

  return {
    totalImpressions,
    totalClicks,
    ctr: totalImpressions === 0 ? 0 : totalClicks / totalImpressions,
    breakdown: engagements
  };
}

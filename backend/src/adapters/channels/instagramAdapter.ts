export interface PublishPayload {
  narrativeId: string;
  episodeId?: string;
  caption: string;
  mediaUrl?: string;
}

export class InstagramAdapter {
  async publish(payload: PublishPayload): Promise<{ id: string; status: 'queued' }> {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 25));
    return { id: `ig_${payload.narrativeId}`, status: 'queued' };
  }
}

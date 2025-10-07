export interface FacebookPublishResult {
  postId: string;
  status: 'scheduled' | 'published';
}

export class FacebookAdapter {
  async schedule(payload: {
    narrativeId: string;
    body: string;
    publishAt?: Date;
  }): Promise<FacebookPublishResult> {
    await new Promise((resolve) => setTimeout(resolve, 15));
    return {
      postId: `fb_${payload.narrativeId}`,
      status: payload.publishAt ? 'scheduled' : 'published'
    };
  }
}

import { describe, it, expect } from 'vitest';
import { MockImageGenerationAdapter } from '../adapters/imageGeneration';
import { InstagramAdapter } from '../adapters/channels/instagramAdapter';
import { FacebookAdapter } from '../adapters/channels/facebookAdapter';

describe('channel adapters', () => {
  it('creates mock images and schedules posts', async () => {
    const imageAdapter = new MockImageGenerationAdapter();
    const image = await imageAdapter.generateImage('Lisbon skyline at dusk');
    expect(image.url).toContain('Lisbon');

    const instagramAdapter = new InstagramAdapter();
    const instagramResult = await instagramAdapter.publish({
      narrativeId: 'echoes',
      caption: 'Echoes of Lisboa teaser'
    });
    expect(instagramResult.status).toBe('queued');

    const facebookAdapter = new FacebookAdapter();
    const facebookResult = await facebookAdapter.schedule({
      narrativeId: 'echoes',
      body: 'Echoes of Lisboa goes live tonight!'
    });
    expect(facebookResult.status).toBe('published');
  });
});

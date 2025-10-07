import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildServer } from '../index';
import { prisma } from '../config/prisma';

const app = buildServer();

describe('approval flow', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('creates approval requests and sends email', async () => {
    vi.spyOn(prisma.prompt, 'findUnique').mockResolvedValue({
      id: 'prompt-1',
      content: 'Prompt content',
      narrativeId: 'echoes'
    } as any);
    vi.spyOn(prisma.narrative, 'findUnique').mockResolvedValue({
      id: 'echoes',
      title: 'Echoes of Lisboa'
    } as any);
    vi.spyOn(prisma.approvalRequest, 'create').mockResolvedValue({ id: 'approval-1' } as any);

    const response = await app.inject({
      method: 'POST',
      url: '/api/narratives/echoes/approvals',
      payload: {
        reviewerEmail: 'producer@example.com',
        promptId: 'prompt-1',
        approvalLink: 'https://echoes.local/approve/123'
      }
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ approvalId: 'approval-1' });
  });
});

import { test, expect } from '@playwright/test';
import { buildServer } from '../../index';
import { prisma } from '../../config/prisma';

type Restore = () => void;

let serverUrl: string;
const app = buildServer();
const restores: Restore[] = [];

test.beforeAll(async () => {
  const address = await app.listen({ port: 0, host: '127.0.0.1' });
  const port = typeof address === 'string' ? Number(address.split(':').pop()) : (address as any).port;
  serverUrl = `http://127.0.0.1:${port}`;

  const narrativeFindUnique = prisma.narrative.findUnique.bind(prisma.narrative);
  prisma.narrative.findUnique = (async (args: any) => {
    if (args?.where?.id === 'echoes-of-lisboa') {
      return { id: 'echoes-of-lisboa', title: 'Echoes of Lisboa' } as any;
    }
    return narrativeFindUnique(args);
  }) as any;
  restores.push(() => {
    prisma.narrative.findUnique = narrativeFindUnique as any;
  });

  const promptCreate = prisma.prompt.create.bind(prisma.prompt);
  prisma.prompt.create = (async () => ({ id: 'prompt-123', content: 'mock', narrativeId: 'echoes-of-lisboa' })) as any;
  restores.push(() => {
    prisma.prompt.create = promptCreate as any;
  });

  const promptFindMany = prisma.prompt.findMany.bind(prisma.prompt);
  prisma.prompt.findMany = (async () => [
    { id: 'prompt-1', content: 'memory lane', narrativeId: 'echoes-of-lisboa', createdAt: new Date(), version: 1, embedding: null }
  ]) as any;
  restores.push(() => {
    prisma.prompt.findMany = promptFindMany as any;
  });

  const promptFindUnique = prisma.prompt.findUnique.bind(prisma.prompt);
  prisma.prompt.findUnique = (async () => ({
    id: 'prompt-123',
    content: 'Prompt for approval',
    narrativeId: 'echoes-of-lisboa'
  })) as any;
  restores.push(() => {
    prisma.prompt.findUnique = promptFindUnique as any;
  });

  const approvalCreate = prisma.approvalRequest.create.bind(prisma.approvalRequest);
  prisma.approvalRequest.create = (async () => ({ id: 'approval-xyz' })) as any;
  restores.push(() => {
    prisma.approvalRequest.create = approvalCreate as any;
  });

  const engagementFindMany = prisma.engagement.findMany.bind(prisma.engagement);
  prisma.engagement.findMany = (async () => []) as any;
  restores.push(() => {
    prisma.engagement.findMany = engagementFindMany as any;
  });
});

test.afterAll(async () => {
  restores.forEach((restore) => restore());
  await app.close();
});

test('composer to approval happy path', async ({ request }) => {
  const composeResponse = await request.post(`${serverUrl}/api/narratives/echoes-of-lisboa/prompts`, {
    data: { idea: 'A Lisbon memory surfaces', tone: 'cinematic' }
  });
  expect(composeResponse.ok()).toBeTruthy();
  const composeJson = await composeResponse.json();
  expect(composeJson.promptId).toBe('prompt-123');

  const approvalResponse = await request.post(`${serverUrl}/api/narratives/echoes-of-lisboa/approvals`, {
    data: {
      reviewerEmail: 'producer@example.com',
      promptId: 'prompt-123',
      approvalLink: 'https://echoes.local/approval/prompt-123'
    }
  });
  expect(approvalResponse.ok()).toBeTruthy();
  const approvalJson = await approvalResponse.json();
  expect(approvalJson.approvalId).toBe('approval-xyz');
});

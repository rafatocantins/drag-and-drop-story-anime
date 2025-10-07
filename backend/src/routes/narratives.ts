import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { HashingEmbeddingProvider } from '../services/embeddings';
import { MemoryComposer } from '../services/memoryComposer';
import { buildNarrativePrompt } from '../services/promptBuilder';
import { MockImageGenerationAdapter } from '../adapters/imageGeneration';
import { InstagramAdapter } from '../adapters/channels/instagramAdapter';
import { FacebookAdapter } from '../adapters/channels/facebookAdapter';
import { sendApprovalEmail } from '../emails/approvalWorkflow';
import { ensureQueues } from '../queues';
import { recordAnalyticsEvent, getAnalyticsSummary } from '../analytics/collector';

const composeSchema = z.object({
  idea: z.string().min(5),
  tone: z.enum(['cinematic', 'investigative', 'playful']).optional()
});

const approvalSchema = z.object({
  reviewerEmail: z.string().email(),
  promptId: z.string(),
  approvalLink: z.string().url()
});

const analyticsSchema = z.object({
  channel: z.enum(['instagram', 'facebook', 'tiktok', 'youtube']),
  impressions: z.number().int().nonnegative(),
  clicks: z.number().int().nonnegative()
});

export async function registerNarrativeRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({ status: 'ok' }));

  app.get('/api/narratives', async () => {
    return prisma.narrative.findMany({
      include: { episodes: true, characters: true, polls: { include: { options: true } } }
    });
  });

  app.get('/api/narratives/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const narrative = await prisma.narrative.findUnique({
      where: { id },
      include: {
        episodes: { orderBy: { order: 'asc' } },
        characters: true,
        polls: { include: { options: true } },
        engagements: true,
        prompts: true
      }
    });
    if (!narrative) {
      return reply.status(404).send({ message: 'Narrative not found' });
    }
    return narrative;
  });

  app.post('/api/narratives/:id/prompts', async (request, reply) => {
    const { id } = request.params as { id: string };
    const parseResult = composeSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send(parseResult.error.flatten());
    }

    const narrative = await prisma.narrative.findUnique({
      where: { id },
      include: { episodes: { orderBy: { order: 'asc' } } }
    });
    if (!narrative) {
      return reply.status(404).send({ message: 'Narrative not found' });
    }

    const focusEpisode = narrative.episodes[0] ?? null;
    const basePrompt = buildNarrativePrompt({ narrative, focusEpisode: focusEpisode ?? undefined, tone: parseResult.data.tone });

    const composer = new MemoryComposer({ embeddingProvider: new HashingEmbeddingProvider() });
    const composed = await composer.compose(id, parseResult.data.idea);

    const finalPrompt = `${basePrompt}\n\n${composed.prompt}`;

    const promptRecord = await prisma.prompt.create({
      data: {
        narrativeId: id,
        content: finalPrompt
      }
    });

    return { prompt: finalPrompt, promptId: promptRecord.id, references: composed.references };
  });

  app.post('/api/narratives/:id/approvals', async (request, reply) => {
    const { id } = request.params as { id: string };
    const parseResult = approvalSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send(parseResult.error.flatten());
    }

    const prompt = await prisma.prompt.findUnique({ where: { id: parseResult.data.promptId } });
    if (!prompt) {
      return reply.status(404).send({ message: 'Prompt not found' });
    }

    const narrative = await prisma.narrative.findUnique({ where: { id } });
    if (!narrative) {
      return reply.status(404).send({ message: 'Narrative not found' });
    }

    const approval = await prisma.approvalRequest.create({
      data: {
        narrativeId: id,
        promptId: prompt.id,
        reviewerEmail: parseResult.data.reviewerEmail
      }
    });

    await sendApprovalEmail({
      narrativeTitle: narrative.title,
      reviewerEmail: parseResult.data.reviewerEmail,
      approvalLink: parseResult.data.approvalLink,
      promptPreview: prompt.content.slice(0, 240)
    });

    const { approvalQueue } = await ensureQueues();
    await approvalQueue?.add('approval', { approvalId: approval.id });

    return { approvalId: approval.id };
  });

  app.post('/api/narratives/:id/analytics', async (request, reply) => {
    const { id } = request.params as { id: string };
    const parseResult = analyticsSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send(parseResult.error.flatten());
    }
    await recordAnalyticsEvent({ narrativeId: id, ...parseResult.data });
    const { analyticsQueue } = await ensureQueues();
    await analyticsQueue?.add('analytics', { narrativeId: id, ...parseResult.data });
    return { status: 'recorded' };
  });

  app.get('/api/narratives/:id/analytics', async (request, reply) => {
    const { id } = request.params as { id: string };
    const summary = await getAnalyticsSummary(id);
    if (!summary) {
      return reply.status(404).send({ message: 'Narrative not found' });
    }
    return summary;
  });

  app.post('/api/narratives/:id/publish', async (request, reply) => {
    const { id } = request.params as { id: string };
    const scheduleSchema = z.object({
      caption: z.string().min(5),
      body: z.string().min(5),
      mediaPrompt: z.string().min(5)
    });
    const parseResult = scheduleSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send(parseResult.error.flatten());
    }

    const narrative = await prisma.narrative.findUnique({ where: { id } });
    if (!narrative) {
      return reply.status(404).send({ message: 'Narrative not found' });
    }

    const imageAdapter = new MockImageGenerationAdapter();
    const image = await imageAdapter.generateImage(parseResult.data.mediaPrompt);

    const instagramAdapter = new InstagramAdapter();
    const instagramResult = await instagramAdapter.publish({
      narrativeId: id,
      caption: parseResult.data.caption,
      mediaUrl: image.url
    });

    const facebookAdapter = new FacebookAdapter();
    const facebookResult = await facebookAdapter.schedule({
      narrativeId: id,
      body: parseResult.data.body
    });

    return { image, instagramResult, facebookResult };
  });
}

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryComposer } from '../services/memoryComposer';
import { HashingEmbeddingProvider } from '../services/embeddings';
import { prisma } from '../config/prisma';

describe('MemoryComposer', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('composes a prompt referencing nearest memories', async () => {
    vi.spyOn(prisma.prompt, 'findMany').mockResolvedValueOnce([
      { id: 'prompt-1', content: 'Lisbon memory of revolution night', narrativeId: 'echoes', version: 1, embedding: null, createdAt: new Date() }
    ] as any);
    vi.spyOn(prisma.prompt, 'findMany').mockResolvedValueOnce([
      { id: 'prompt-1', content: 'Lisbon memory of revolution night', narrativeId: 'echoes', version: 1, embedding: null, createdAt: new Date() }
    ] as any);

    const composer = new MemoryComposer({ embeddingProvider: new HashingEmbeddingProvider() });
    const result = await composer.compose('echoes', 'revolution memory');
    expect(result.prompt).toContain('Echoes Studio Composer');
    expect(result.references).toHaveLength(1);
  });
});

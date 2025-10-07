import { prisma } from '../config/prisma';
import { EmbeddingProvider } from './embeddings';
import { VectorStore } from './vectorStore';

export interface MemoryComposerOptions {
  embeddingProvider: EmbeddingProvider;
}

export interface ComposerResult {
  prompt: string;
  references: { id: string; similarity: number }[];
}

export class MemoryComposer {
  private readonly vectorStore = new VectorStore<{ promptId: string }>();

  constructor(private readonly options: MemoryComposerOptions) {}

  async hydrate(narrativeId: string) {
    const prompts = await prisma.prompt.findMany({
      where: { narrativeId },
      orderBy: { createdAt: 'desc' }
    });

    for (const prompt of prompts) {
      const vector = await this.options.embeddingProvider.embed(prompt.content);
      this.vectorStore.add({ id: prompt.id, vector, metadata: { promptId: prompt.id } });
    }
  }

  async compose(narrativeId: string, idea: string): Promise<ComposerResult> {
    await this.hydrate(narrativeId);
    const queryVector = await this.options.embeddingProvider.embed(idea);
    const references = this.vectorStore.search(queryVector, 3);

    const referenceTexts = await prisma.prompt.findMany({
      where: { id: { in: references.map((r) => r.id) } },
      select: { id: true, content: true }
    });

    const promptBody = [
      '# Echoes Studio Composer',
      `Idea: ${idea}`,
      '',
      '## References',
      ...referenceTexts.map((ref, index) => `(${index + 1}) ${ref.content.slice(0, 280)}...`)
    ].join('\n');

    return {
      prompt: promptBody,
      references: references.map((ref, index) => ({
        id: referenceTexts[index]?.id ?? ref.id,
        similarity: index === 0 ? 1 : Math.max(0.1, 1 - index * 0.2)
      }))
    };
  }
}

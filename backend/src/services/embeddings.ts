export interface EmbeddingProvider {
  embed(text: string): Promise<number[]>;
}

const DEFAULT_VECTOR_SIZE = 12;

export class HashingEmbeddingProvider implements EmbeddingProvider {
  constructor(private readonly dimensions = DEFAULT_VECTOR_SIZE) {}

  async embed(text: string): Promise<number[]> {
    const vector = new Array(this.dimensions).fill(0);
    for (let i = 0; i < text.length; i += 1) {
      const char = text.charCodeAt(i);
      const index = char % this.dimensions;
      vector[index] += (char % 97) / 100;
    }
    const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
    return vector.map((value) => value / magnitude);
  }
}

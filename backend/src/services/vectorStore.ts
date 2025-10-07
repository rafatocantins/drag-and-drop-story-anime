export interface VectorRecord<TMeta = Record<string, unknown>> {
  id: string;
  vector: number[];
  metadata: TMeta;
}

export class VectorStore<TMeta = Record<string, unknown>> {
  private readonly records: VectorRecord<TMeta>[] = [];

  add(record: VectorRecord<TMeta>) {
    this.records.push(record);
  }

  search(query: number[], limit = 5): VectorRecord<TMeta>[] {
    const scored = this.records.map((record) => ({
      record,
      score: cosineSimilarity(query, record.vector)
    }));
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((entry) => entry.record);
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  const length = Math.min(a.length, b.length);
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < length; i += 1) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / ((Math.sqrt(magA) || 1) * (Math.sqrt(magB) || 1));
}

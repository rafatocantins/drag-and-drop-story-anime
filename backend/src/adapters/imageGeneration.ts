export interface ImageGenerationResult {
  url: string;
  prompt: string;
}

export interface ImageGenerationAdapter {
  generateImage(prompt: string): Promise<ImageGenerationResult>;
}

export class MockImageGenerationAdapter implements ImageGenerationAdapter {
  async generateImage(prompt: string): Promise<ImageGenerationResult> {
    return {
      prompt,
      url: `https://images.echoes.local/mock/${encodeURIComponent(prompt.slice(0, 32))}`
    };
  }
}

import { pipeline } from '@huggingface/transformers';

class EmbeddingService {
  private extractor: any = null;
  private loadingPromise: Promise<void> | null = null;

  async init() {
    if (this.extractor) return;
    
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = (async () => {
      console.log('🤖 Carregando modelo de embeddings...');
      this.extractor = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2',
        {
          // Opcional: usar WebGPU se disponível
          device: 'webgpu', // ou 'webgpu' se suportado
        }
      );
      console.log('✅ Modelo carregado!');
    })();

    return this.loadingPromise;
  }

  async getEmbedding(text: string): Promise<number[]> {
    await this.init();
    
    const output = await this.extractor(text, {
      pooling: 'mean',
      normalize: true,
    });
    
    return Array.from(output.data);
  }
}

export const embeddingService = new EmbeddingService();
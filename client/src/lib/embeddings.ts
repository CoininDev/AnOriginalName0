import { pipeline, env } from '@huggingface/transformers';

// Configurações para melhorar a resiliência do download e cache
env.allowLocalModels = false;
env.useBrowserCache = true;

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
      
      // Verifica se o navegador suporta WebGPU nativamente
      const hasWebGPU = 'gpu' in navigator;
      const device = hasWebGPU ? 'webgpu' : 'wasm';
      
      console.log(`Usando dispositivo de inferência: ${device}`);
      
      this.extractor = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2',
        { device } // Usa o dispositivo detectado dinamicamente
      );
      console.log('✅ Modelo carregado com sucesso!');
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
import { pipeline, env } from '@huggingface/transformers';

// Configuração para produção e ambiente local
env.allowLocalModels = true;       // Permite carregar da pasta 'public'
env.useBrowserCache = true;        // Armazena no navegador após o 1º carregamento
env.localModelPath = '/models';    // Aponta para a pasta 'public/models'

class EmbeddingService {
  private extractor: any = null;
  private loadingPromise: Promise<void> | null = null;

  async init() {
    if (this.extractor) return;
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = (async () => {
      console.log('🤖 Carregando modelo de embeddings...');
      
      const hasWebGPU = 'gpu' in navigator;
      const device = hasWebGPU ? 'webgpu' : 'wasm';
      console.log(`Usando dispositivo de inferência: ${device}`);
      
      try {
        this.extractor = await pipeline(
          'feature-extraction',
          'Xenova/all-MiniLM-L6-v2', // O nome permanece, mas o env.localModelPath intercepta
          {
            device,
            quantized: true
          }
        );
        console.log('✅ Modelo carregado com sucesso!');
      } catch (error) {
        console.error('❌ Falha ao carregar o modelo:', error);
        throw new Error('Falha ao carregar o modelo. Verifique se o arquivo .onnx tem ~25MB e não é um ponteiro Git.');
      }
    })();

    return this.loadingPromise;
  }

  async getEmbedding(text: string): Promise<number[]> {
    await this.init();
    const output = await this.extractor(text, { 
      pooling: 'mean', 
      normalize: true 
    });
    return Array.from(output.data);
  }
}

export const embeddingService = new EmbeddingService();
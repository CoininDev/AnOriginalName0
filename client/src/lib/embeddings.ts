import { pipeline, env } from '@huggingface/transformers';

// Konfiguration für Produktion erzwingen
env.allowLocalModels = true;       // Erlaubt das Laden aus dem eigenen 'public' Ordner
env.useBrowserCache = true;        // Speichert es im Browser für spätere Besuche
env.localModelPath = '/models';    // Basispfad zu deinem public/models Ordner

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
      
      // WICHTIG: Der Pfad ist jetzt relativ zu deinem public-Ordner!
      this.extractor = await pipeline(
        'feature-extraction',
        'all-MiniLM-L6-v2', // Kein 'Xenova/' Prefix mehr, da es lokal liegt!
        { 
          device,
          // Fallback, falls es doch remote geladen werden muss
          revision: 'main' 
        }
      );
      console.log('✅ Modelo carregado com sucesso!');
    })();

    return this.loadingPromise;
  }

  async getEmbedding(text: string): Promise<number[]> {
    await this.init();
    const output = await this.extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }
}

export const embeddingService = new EmbeddingService();
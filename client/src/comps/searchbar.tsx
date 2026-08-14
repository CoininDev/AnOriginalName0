import React, {useEffect, useState } from 'react';
import { embeddingService } from '@/lib/embeddings';
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const API_URL = import.meta.env.VITE_API_URL || '';


interface MostSimilarText {
    Distance: number;
    ID: number;
    Text: string;
}

interface ApiResponse {
  most_similar: MostSimilarText[];
  originality: number;
  text: string;
}

interface SearchAPIProps {
  onSearch: (data: ApiResponse) => void;
}

const SearchBar: React.FC<SearchAPIProps> = ({ onSearch }) => {
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [modelLoading, setModelLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    embeddingService.init()
      .then(() => setModelLoading(false))
      .catch((err) => setError('Erro ao carregar modelo local: ' + err.message))
  }, [])

  const handleSearch = async () => {
    setLoading(true);
    setError('');

    try {
      //embedding locally
      const embedding = await embeddingService.getEmbedding(input);
      const response = await fetch(`${API_URL}/texts/compare-and-save`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          text: input,
          embedding: embedding
        })
      });

      if (!response.ok) throw new Error('Erro ao buscar dados');
      const data: ApiResponse = await response.json();
      onSearch(data);
    } catch (e: any) {
      setError(e.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter"){
      e.preventDefault();
      handleSearch()
    }
  }

  return (
    <div>
      <div className='flex gap-2'>
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite seu texto aqui"
          disabled={modelLoading}
        />
        <Button 
          onClick={handleSearch} 
          disabled={loading || !input || modelLoading}
        >
          {modelLoading ? 'Carregando modelo...' : loading ? 'Pesquisando...' : 'Pesquisar'}
        </Button>
      </div>
      {modelLoading && (
        <p className="text-sm text-muted-foreground mt-2">
          Baixando modelo de IA (~90MB, apenas na primeira vez)...
        </p>
      )}
      {error && <Badge variant="destructive" className='mt-3'>{error}</Badge>}
    </div>
  );
};

export default SearchBar;
export type { ApiResponse };
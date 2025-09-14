import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
  const [error, setError] = useState<string>('');
  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('api/texts/compare-and-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
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
        />
        <Button onClick={handleSearch} disabled={loading || !input}>
          {loading ? 'Pesquisando...' : 'Pesquisar'}
        </Button>
      </div>
      {error && <Badge variant="destructive" className='mt-3'>{error}</Badge>}
    </div>
  );
};

export default SearchBar;
export type { ApiResponse };
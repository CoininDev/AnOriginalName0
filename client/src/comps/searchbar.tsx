import React, { useState } from 'react';

interface MostSimilarText {
    Distance: number;
    ID: number;
    Text: string;
}

interface ApiResponse {
  most_similar: MostSimilarText;
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
      const response = await fetch('api/compare', {
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

  return (
    <div style={{ maxWidth: 500, margin: 'auto' }}>
      <h2>Pesquisar Texto</h2>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={4}
        style={{ width: '100%' }}
        placeholder="Digite seu texto aqui"
      />
      <button onClick={handleSearch} disabled={loading || !input}>
        {loading ? 'Pesquisando...' : 'Pesquisar'}
      </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SearchBar;
export type { ApiResponse };
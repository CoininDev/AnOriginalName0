import React, { useState } from 'react';

interface MostSimilarText {
    Distance: number;
    ID: Number;
    Text: string;
}

interface ApiResponse {
  most_similar: MostSimilarText;
  originality: number;
  text: string;
}

const SearchAPI: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch('http://localhost:6868/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      });
      if (!response.ok) throw new Error('Erro ao buscar dados');
      const data: ApiResponse = await response.json();
      setResult(data);
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
      {result && (
        <div style={{ marginTop: 16, border: '1px solid #ccc', padding: 8 }}>
          <p><strong>Texto mais parecido:</strong> {result.most_similar.Text}</p>
          <p><strong>Pontuação de originalidade:</strong> {result.originality}</p>
          <p><strong>Seu texto:</strong> {result.text}</p>
        </div>
      )}
    </div>
  );
};

export default SearchAPI;
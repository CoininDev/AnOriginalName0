import React from 'react';
import { ApiResponse } from './searchbar';

interface HistoryListProps {
  history: ApiResponse[];
}

const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  return (
    <div style={{ maxWidth: 500, margin: 'auto', marginTop: 20 }}>
      <h2>Histórico de Pesquisas</h2>
      {history.length === 0 ? (
        <p>Digite algo para comparar e adicionar no banco de dados :).</p>
      ) : (
        history.map((item, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8 }}>
            <p><strong>Texto pesquisado:</strong> {item.text}</p>
            <p><strong>Texto mais parecido:</strong> {item.most_similar.Text}</p>
            <p><strong>Pontuação de originalidade:</strong> {item.originality}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default HistoryList;
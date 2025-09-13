import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SearchBar, { ApiResponse } from './comps/searchbar';
import HistoryList from './comps/history_list';

const App: React.FC = () => {
  var [history, setHistory] = React.useState<ApiResponse[]>([]);
   const addResult = (result: ApiResponse) => {
    setHistory(prev => [result, ...prev]); // adiciona no topo
  };

  return (
    <div>
      <h1>An Original Name</h1>
      <SearchBar onSearch={addResult} />
      <HistoryList history={history} />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

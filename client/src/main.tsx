import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SearchAPI from './apps/lolo'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SearchAPI></SearchAPI>
  </StrictMode>,
)

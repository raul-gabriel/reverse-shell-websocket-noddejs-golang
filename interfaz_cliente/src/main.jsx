import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Rutas from './Rutas'
import 'bootstrap/dist/css/bootstrap.min.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Rutas/>
  </StrictMode>,
)

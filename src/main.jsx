import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { AudioProvider } from './Context/AudioContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <AudioProvider> */}
      <App />
    {/* </AudioProvider> */}
  </StrictMode>,
)

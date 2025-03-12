
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './components/ThemeProvider.jsx'
import './index.css'
import App from './App.jsx'
createRoot(document.getElementById('root')).render(
<>
    <ThemeProvider/>
    <App/>
</>
)

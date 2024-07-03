import {BrowserRouter} from 'react-router-dom'
import './App.css'
import RoutesSetup from './routes/RoutesSetup'

function App() {
  return (
    <BrowserRouter>
      <RoutesSetup />
    </BrowserRouter>
  )
}

export default App

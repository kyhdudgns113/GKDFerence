import {BrowserRouter} from 'react-router-dom'
import './App.css'
import RoutesSetup from './routes/RoutesSetup'
import {AuthProvider} from './contexts/AuthContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoutesSetup />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

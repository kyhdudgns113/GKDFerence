import {BrowserRouter} from 'react-router-dom'
import './App.css'
import RoutesSetup from './routes/RoutesSetup'
import {AuthProvider} from './contexts/AuthContext'
import {SocketProvider} from './contexts/SocketContext'

function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <AuthProvider>
          <RoutesSetup />
        </AuthProvider>
      </SocketProvider>
    </BrowserRouter>
  )
}

export default App

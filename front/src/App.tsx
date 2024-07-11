import {BrowserRouter} from 'react-router-dom'
import './App.css'
import RoutesSetup from './routes/RoutesSetup'
import {AuthProvider, SocketProvider} from './contexts'

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

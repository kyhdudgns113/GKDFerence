import {BrowserRouter} from 'react-router-dom'
import './App.css'
import RoutesSetup from './routes/RoutesSetup'
import {AuthProvider, SocketProvider} from './contexts'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <RoutesSetup />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

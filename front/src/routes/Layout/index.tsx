import {Outlet} from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import {Modal} from '../../components/Base/Modal'
import {useLayoutModalContext} from '../../contexts/LayoutModalContext'

export default function Layout() {
  const {isOpen, onClose} = useLayoutModalContext()
  return (
    <div className="DIV_LAYOUT flex flex-col">
      <div className="p-4">
        <Header />
      </div>
      <div className="flex flex-row">
        <Sidebar />
        <div className="flex flex-col w-full">
          <Outlet />
          <Footer />
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}></Modal>
    </div>
  )
}

import {Outlet} from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import Modals from './Modals'

export default function Layout() {
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
      <Modals />
    </div>
  )
}

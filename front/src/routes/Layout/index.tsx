import {Outlet} from 'react-router-dom'
import Header from './Header/Header'
import Footer from './Footer'
import Sidebar from './Sidebar/Sidebar'
import Modals from './Modals/Modals'

export default function Layout() {
  return (
    <div className="DIV_LAYOUT flex flex-col h-screen ">
      <div className="p-4">
        <Header />
      </div>
      <div className="flex flex-row h-full">
        <Sidebar />
        <div className="flex flex-col w-full h-full border-2 border-gkd-sakura-border">
          <Outlet />
          <Footer />
        </div>
      </div>
      <Modals />
    </div>
  )
}

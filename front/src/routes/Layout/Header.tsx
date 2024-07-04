import {Home, Logout, MyAccount} from '../../components/Layout/Header'

export default function Header() {
  //
  return (
    <div className="flex flex-row">
      <Home />
      <MyAccount />
      <Logout />
    </div>
  )
}

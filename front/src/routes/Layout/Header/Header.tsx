import {Home, Logout, MyAccount, Text} from './components'
import {Icon} from '../../../components'

export default function Header() {
  const className_DivCommon = [
    'cursor-pointer',
    'flex flex-row', //
    'items-center',
    'ml-2 mr-2'
  ].join(' ')

  return (
    <div className="flex flex-row">
      <Home />
      <MyAccount />
      <Logout />
      <div className={className_DivCommon} onClick={e => {}}>
        <Icon name="restart_alt" className="text-3xl"></Icon>
        <Text>Reset</Text>
      </div>
      <div className="flex flex-row items-center ml-4">
        <Text>Test : {931103}</Text>
      </div>
    </div>
  )
}

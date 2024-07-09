import {MouseEvent, useCallback} from 'react'
import {Home, Logout, MyAccount, Text} from '../../components/Layout/Header'
import {Icon} from '../../components'
import {useLayoutContext} from '../../contexts/LayoutContext'

export default function Header() {
  const {testCnt, setTestCnt} = useLayoutContext()

  const className_DivCommon = [
    'cursor-pointer',
    'flex flex-row', //
    'items-center',
    'ml-2 mr-2'
  ].join(' ')

  const onClickDivReset = useCallback(
    (e: MouseEvent) => {
      setTestCnt(0)
    },
    [setTestCnt]
  )

  return (
    <div className="flex flex-row">
      <Home />
      <MyAccount />
      <Logout />
      <div className={className_DivCommon} onClick={onClickDivReset}>
        <Icon name="restart_alt" className="text-3xl"></Icon>
        <Text>Reset</Text>
      </div>
      <div className="flex flex-row items-center ml-4">
        <Text>Test : {testCnt}</Text>
      </div>
    </div>
  )
}

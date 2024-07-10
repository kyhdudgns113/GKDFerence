import {MouseEvent, useCallback} from 'react'
import {TestButton} from '../../components'
import {useLayoutContext} from '../../contexts/LayoutContext'
import * as C from '../../components/Layout/Sidebar'
import * as CN from './className'
import {useSocketContext} from '../../contexts/SocketContext'
import {SocketTestCountType} from '../../contexts/SocketContext/types'
import {useAuth} from '../../contexts/AuthContext'

export default function Sidebar() {
  const {testCnt, setTestCnt} = useLayoutContext()
  const {socketP: socket} = useSocketContext()

  const {id, checkToken, refreshToken} = useAuth()

  const onClickInc = useCallback(
    (e: MouseEvent) => {
      setTestCnt(prev => prev + 1)
    },
    [setTestCnt]
  )

  const onClickSockInc = useCallback(
    (e: MouseEvent) => {
      if (socket) {
        const sendObj: SocketTestCountType = {
          id: id || '',
          cnt: testCnt || 0
        }
        socket.emit('test count', sendObj)
      } else {
        console.log('Why not socket')
      }
    },
    [socket, testCnt, id]
  )

  const onClickCheck = useCallback(
    (e: MouseEvent) => {
      checkToken()
    },
    [checkToken]
  )

  const onClickRefresh = useCallback(
    (e: MouseEvent) => {
      refreshToken()
    },
    [refreshToken]
  )

  return (
    <div className={CN.classNameEntireSidebar} style={{minWidth: '250px'}}>
      <div className="GKD_LIST_AREA">
        <C.ConferenceList />
        <C.ChattingList />
        <C.DocumentList />
      </div>
      <div className="flex flex-col items-center justify-center mt-2">
        <TestButton onClick={onClickInc}>Inc</TestButton>
        <TestButton onClick={onClickSockInc}>Sock Inc</TestButton>
        <TestButton onClick={onClickCheck}>Token C</TestButton>
        <TestButton onClick={onClickRefresh}>Token R</TestButton>
      </div>
    </div>
  )
}

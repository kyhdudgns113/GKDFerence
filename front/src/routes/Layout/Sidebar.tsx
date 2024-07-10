import {MouseEvent, useCallback} from 'react'
import {Button} from '../../components'
import {useLayoutContext} from '../../contexts/LayoutContext'
import * as C from '../../components/Layout/Sidebar'
import * as CN from './className'
import {useSocketContext} from '../../contexts/SocketContext'
import {SocketTestCountType} from '../../contexts/SocketContext/types'

export default function Sidebar() {
  const {testCnt, setTestCnt} = useLayoutContext()
  const {socketP: socket} = useSocketContext()

  const onClickSocketButtontConst = useCallback(
    (e: MouseEvent) => {
      if (socket) {
        const sendObj: SocketTestCountType = {
          id: 'yes',
          cnt: testCnt || 0
        }
        socket.emit('test count', sendObj)
      } else {
        console.log('Why not socket')
      }
    },
    [socket, testCnt]
  )

  return (
    <div className={CN.classNameEntireSidebar} style={{minWidth: '250px'}}>
      <div className="GKD_LIST_AREA">
        <C.ConferenceList />
        <C.ChattingList />
        <C.DocumentList />
      </div>
      <div className={CN.classNameTestButton}>
        <Button
          onClick={e => {
            setTestCnt(prev => prev + 1)
          }}>
          Just Increase
        </Button>
      </div>
      <div className={CN.classNameTestButton}>
        <Button onClick={onClickSocketButtontConst}>Socket Increase</Button>
      </div>
    </div>
  )
}

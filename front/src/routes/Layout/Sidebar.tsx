import {useCallback, useEffect} from 'react' // eslint-disable-line

import {TestButton} from '../../components'
import {SocketTestCountType} from '../../common'

import * as CT from '../../contexts'
import * as C from '../../components/Layout/Sidebar'
import * as CN from './className'
import * as U from '../../utils'
import {get} from '../../server'

export default function Sidebar() {
  const {testCnt, setTestCnt, setChatRooms} = CT.useLayoutContext()
  const {socketP, socketEmit} = CT.useSocketContext()

  const {id, _id, checkToken, refreshToken} = CT.useAuth()

  const {onTestOpen} = CT.useLayoutModalContext()

  const onClickSockInc = useCallback(
    (testCnt: number | undefined) => {
      const sendObj: SocketTestCountType = {
        id: id || '',
        cnt: testCnt || 0
      }
      socketEmit(socketP, 'test count', sendObj)
    },
    [id, socketP, socketEmit]
  )

  /**
   * 채팅방 리스트 가져오기
   * 새로고침등의 이슈로 setId, set_id 가 호출되지 않을 수 있다.
   * 이런 경우에 id, _id 는 null 일 수 있다.
   */
  useEffect(() => {
    if (id && _id) {
      U.readStringP('jwt').then(jwt => {
        if (jwt) {
          get(`/sidebar/getChatList/${_id}`, jwt)
            .then(res => res.json())
            .then(res => {
              const {ok, body} = res
              if (ok) {
                setChatRooms(body.chatRoomList)
              } else {
              }
            })
        } else {
        }
      })
    }
  }, [id, _id, setChatRooms])

  return (
    <div className={CN.classNameEntireSidebar} style={{minWidth: '250px'}}>
      <div className="GKD_LIST_AREA">
        <C.ConferenceList />
        <C.ChattingList />
        <C.DocumentList />
      </div>
      <div className="GKD_TestBtn_Area flex flex-col items-center justify-center mt-2">
        <TestButton onClick={e => setTestCnt(prev => prev + 1)}>Inc</TestButton>
        <TestButton onClick={e => onClickSockInc(testCnt)}>Sock Inc</TestButton>
        <TestButton onClick={e => checkToken()}>Token C</TestButton>
        <TestButton onClick={e => refreshToken()}>Token R</TestButton>
        <TestButton onClick={e => onTestOpen()}>Test Modal</TestButton>
      </div>
    </div>
  )
}

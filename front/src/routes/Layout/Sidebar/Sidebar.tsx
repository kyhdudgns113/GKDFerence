import {useCallback, useEffect} from 'react'

import {TestButton} from '../../../components'
import {get, post} from '../../../server'

import * as CT from '../../../contexts'
import * as C from './components'
import {SidebarBodyType} from '../../../common'
import {useNavigate} from 'react-router-dom'

export default function Sidebar() {
  const {setChatRooms, setDocumentGs} = CT.useLayoutContext()
  const {id, uOId, email, getJwt, refreshToken} = CT.useAuth()
  const {onCreateChatOpen} = CT.useLayoutModalContext()

  const navigate = useNavigate()

  // FUTURE: 생성하겠냐고 물어본 뒤에 만들어야 한다.
  // FUTURE: 광클 방지기능 넣어야 한다는 의미.
  const onClickCreateDocument = useCallback(async () => {
    if (uOId) {
      const jwtFromClient = await getJwt()
      const payload: SidebarBodyType = {
        jwt: jwtFromClient,
        id: id,
        uOId: uOId,
        email: email
      }
      post(`/sidebar/createDocument`, payload)
        .then(res => res.json())
        .then(res => {
          const {ok} = res // eslint-disable-line
          if (ok) {
            navigate('/')
          } // BLANK LINE COMMENT:
          else {
            //
          }
        })
    }
  }, [email, id, uOId, getJwt, navigate])

  /**
   * 채팅방 리스트 가져오기
   * 새로고침등의 이슈로 setId, setUOId 가 호출되지 않을 수 있다.
   * 이런 경우에 id, uOId 는 null 일 수 있다.
   */
  useEffect(() => {
    if (id && uOId) {
      getJwt().then(jwtFromClient => {
        if (jwtFromClient) {
          get(`/sidebar/getSidebars/${uOId}`, jwtFromClient)
            .then(res => res.json())
            .then(res => {
              const {ok, body} = res
              if (ok) {
                setChatRooms(body.chatRooms)
                setDocumentGs(body.documentGs)
              } // BLANK LINE COMMENT:
              else {
                //
              }
            })
        } // BLANK LINE COMMENT:
        else {
          //
        }
      })
    }
  }, [id, uOId, getJwt, setChatRooms, setDocumentGs])

  return (
    <div className={C.classNameEntireSidebar} style={{minWidth: '250px'}}>
      <div className="GKD_LIST_AREA">
        <C.Conferences />
        <C.ChatRooms />
        <C.Documents />
      </div>
      <div className="GKD_TestBtn_Area flex flex-col items-center justify-center mt-2">
        {/* <TestButton onClick={e => setTestCnt(prev => prev + 1)}>Inc</TestButton> */}
        {/* <TestButton onClick={e => onClickSockInc(testCnt)}>Sock Inc</TestButton> */}
        {/* <TestButton onClick={e => checkToken()}>Token C</TestButton> */}
        <TestButton onClick={e => refreshToken()}>Token R</TestButton>
        <TestButton onClick={e => onCreateChatOpen()}>New Chat</TestButton>
        <TestButton onClick={e => onClickCreateDocument()}>New Document</TestButton>
        {/* <TestButton onClick={e => socketEmit(socketP, 'test lock', 'yes')}>Test Lock</TestButton> */}
      </div>
    </div>
  )
}

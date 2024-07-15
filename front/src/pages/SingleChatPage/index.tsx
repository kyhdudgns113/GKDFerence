import {useEffect, useState} from 'react'
import {io, Socket} from 'socket.io-client'
import {DefaultEventsMap} from 'socket.io/dist/typed-events'

import {useAuth, useLayoutContext, useSocketContext} from '../../contexts'
import {Title} from '../../components'
import {get} from '../../server'
import {serverUrl} from '../../client_secret'
import {SocketChatConnectedType} from '../../common'

export default function SingleChatPage() {
  // NOTE: 페이지 새로고침되서 pageOId 지워진다.
  // NOTE: localStorage 에 넣던가 URL 파싱해서 쓰자.
  // NOTE: 아 로컬 스토리지는 넣으면 안되겠다. 탭 여러개일수도 있다.

  const {pageOId, setPageOId} = useLayoutContext()
  const [sockChat, setSockChat] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null)
  const {_id, jwt} = useAuth()
  const {socketPId} = useSocketContext()

  useEffect(() => {
    const getPageOId = window.location.href.split('/main/sc/')[1]
    setPageOId(getPageOId)

    return () => {
      setPageOId('')
    }
  }, [setPageOId])

  // NOTE: 소켓연결을 해두고 DB 에서 정보를 가져와야 한다.
  // NOTE: 그래야 이후 채팅들을 읽어올 수 있다.
  useEffect(() => {
    if (!sockChat && jwt && _id && pageOId) {
      const newSocket = io(serverUrl)
      setSockChat(newSocket)

      newSocket.on('chat connected', (payload: SocketChatConnectedType) => {
        console.log('CHAT CONNECTED RECEIVED')
      })

      const payload: SocketChatConnectedType = {
        jwt: jwt || '',
        uOId: _id || '',
        cOId: pageOId || '',
        socketPId: socketPId || ''
      }
      newSocket.emit('chat connected', payload)

      get(`/sidebar/chatList/getChatRoomData/${pageOId}`, jwt)
        .then(res => res && res.json())
        .then(res => {
          // const {ok, body, errors} = res //  eslint-disable-line
        })
    }

    return () => {
      if (sockChat && sockChat.connected) {
        sockChat.disconnect()
        setSockChat(null)
      }
    }
  }, [_id, jwt, pageOId, sockChat, setPageOId])
  return (
    <div className="flex flex-col items-center h-full">
      <Title>Single Chat Page</Title>
      <p>{'yes'}</p>
      <p>{pageOId}</p>
    </div>
  )
}

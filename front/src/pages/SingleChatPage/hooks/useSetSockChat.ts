import {useEffect} from 'react'
import {io} from 'socket.io-client'
import {useAuth, useLayoutContext, useSocketContext} from '../../../contexts'
import {serverUrl} from '../../../client_secret'
import {SocketChatConnectedType} from '../../../common'
import {get} from '../../../server'
import {useSingleChatContext} from '../../../contexts/SingleChatContext'

/**
 * 소켓연결을 해두고 DB 에서 정보를 가져와야 한다.
 * 그래야 이후 채팅들을 읽어올 수 있다.
 *
 */
export const useSetSockChat = () => {
  const {sockChat, setSockChat} = useSingleChatContext()
  const {pageOId, setPageOId} = useLayoutContext()
  const {_id, jwt} = useAuth()
  const {socketPId} = useSocketContext()

  useEffect(() => {
    if (!sockChat && jwt && _id && pageOId && socketPId) {
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
  }, [_id, jwt, pageOId, sockChat, socketPId, setPageOId, setSockChat])
}

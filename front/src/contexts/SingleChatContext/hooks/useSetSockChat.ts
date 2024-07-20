import {useEffect} from 'react'
import {
  ChatBlocksType,
  Setter,
  SocketChatConnectedType,
  SocketChatContentType,
  SocketType
} from '../../../common'
import {useSocketContext} from '../../SocketContext/SocketContext'
import {useLayoutContext} from '../../LayoutContext/LayoutContext'
import {io} from 'socket.io-client'
import {serverUrl} from '../../../client_secret'
import {useAuth} from '../../AuthContext/AuthContext'

export const useSetSockChat = (
  sockChat: SocketType,
  uOId: string | undefined,
  setSockChat: Setter<SocketType>,
  setChatQ: Setter<ChatBlocksType>
) => {
  const {jwt} = useAuth()
  const {socketPId} = useSocketContext()
  const {pageOId, setChatRooms} = useLayoutContext()

  useEffect(() => {
    if (!sockChat && socketPId && pageOId) {
      const newSocket = io(serverUrl)
      setSockChat(newSocket)

      newSocket.on('chat connected', (payload: SocketChatConnectedType) => {
        console.log('CHAT CONNECTED : ', payload.cOId)
        setChatRooms(chatRooms =>
          chatRooms.map(chatRoom => {
            if (chatRoom.cOId === payload.cOId) {
              chatRoom.unreadChat = 0
            }
            return chatRoom
          })
        )
      })
      newSocket.on('chat', (payload: SocketChatContentType) => {
        setChatQ(prev => [...prev, payload.body])
      })

      if (!uOId || !jwt || !pageOId) {
        alert('다음이 NULL 입니다. ' + !uOId && 'uOId ' + !jwt && 'jwt ' + !pageOId && 'pageOId ')
      }

      const payload: SocketChatConnectedType = {
        jwt: jwt || '',
        uOId: uOId || '',
        cOId: pageOId || '',
        socketPId: socketPId || ''
      }
      newSocket.emit('chat connected', payload)
    }
  }, [uOId, jwt, pageOId, sockChat, socketPId, setSockChat, setChatQ, setChatRooms])
}

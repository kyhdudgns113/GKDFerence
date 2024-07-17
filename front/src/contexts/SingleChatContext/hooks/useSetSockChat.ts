import {useEffect} from 'react'
import {useAuth} from '../../AuthContext'
import {
  ChatContentType,
  Setter,
  SocketChatConnectedType,
  SocketChatContentType,
  SocketType
} from '../../../common'
import {io} from 'socket.io-client'
import {serverUrl} from '../../../client_secret'
import {useSocketContext} from '../../SocketContext'
import {useLayoutContext} from '../../LayoutContext'

export const useSetSockChat = (
  sockChat: SocketType,
  setSockChat: Setter<SocketType>,
  setChatBlocks: Setter<ChatContentType[]>
) => {
  const {pageOId} = useLayoutContext()
  const {_id, jwt} = useAuth()
  const {socketPId} = useSocketContext()

  useEffect(() => {
    if (!sockChat && socketPId && pageOId) {
      const newSocket = io(serverUrl)
      setSockChat(newSocket)

      newSocket.on('chat connected', (payload: SocketChatConnectedType) => {
        console.log('CHAT CONNECTED : ', payload.cOId)
      })

      newSocket.on('chat', (payload: SocketChatContentType) => {
        setChatBlocks(prev => [...prev, payload.body])
      })

      const payload: SocketChatConnectedType = {
        jwt: jwt || '',
        uOId: _id || '',
        cOId: pageOId || '',
        socketPId: socketPId || ''
      }
      newSocket.emit('chat connected', payload)
    }
  }, [_id, jwt, pageOId, sockChat, socketPId, setSockChat, setChatBlocks])
}

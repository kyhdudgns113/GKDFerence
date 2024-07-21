import {useEffect} from 'react'
import {
  Setter,
  SocketChatConnectedType,
  SocketType
} from '../../../common'
import {useSocketContext} from '../../SocketContext/SocketContext'
import {useLayoutContext} from '../../LayoutContext/LayoutContext'
import {io} from 'socket.io-client'
import {serverUrl} from '../../../client_secret'
import {useAuth} from '../../AuthContext/AuthContext'

export const useSetSockChat = (
  sockChat: SocketType,
  setSockChat: Setter<SocketType>,
  onChatConnected: (newSocket: SocketType) => void,
  onChat: (newSocket: SocketType) => void
) => {
  const {jwt, uOId} = useAuth()
  const {socketPId} = useSocketContext()
  const {pageOId, setChatRooms} = useLayoutContext()

  useEffect(() => {
    if (!sockChat && socketPId && pageOId) {
      const newSocket = io(serverUrl)
      setSockChat(newSocket)

      onChatConnected(newSocket)
      onChat(newSocket)

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
  }, [
    uOId,
    jwt,
    pageOId,
    sockChat,
    socketPId,
    setSockChat,
    setChatRooms,
    onChatConnected,
    onChat
  ])
}

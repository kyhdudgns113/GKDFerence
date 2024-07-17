import type {Dispatch, FC, PropsWithChildren, SetStateAction} from 'react'
import {createContext, useCallback, useContext, useEffect, useState} from 'react'
import {io, Socket} from 'socket.io-client'
import {DefaultEventsMap} from 'socket.io/dist/typed-events'

import {ChatContentType, RowSingleChatRoomType, SocketChatConnectedType} from '../../common'
import {useLocation} from 'react-router-dom'
import SingleChatPage from '../../pages/SingleChatPage'
import {useAuth} from '../AuthContext'
import {useSetCOId} from '../../pages/SingleChatPage/hooks'
import {useSocketContext} from '../SocketContext'
import {serverUrl} from '../../client_secret'
import {useLayoutContext} from '../LayoutContext'
import {get} from '../../server'

type SocketType = Socket<DefaultEventsMap, DefaultEventsMap> | null
type Setter<T> = Dispatch<SetStateAction<T>>

// prettier-ignore
type ContextType = {
  sockChat: SocketType, setSockChat: Setter<SocketType>,
  cOId: string, setCOId: Setter<string>,
  tUOId: string, setTUOId: Setter<string>,
  tUId: string, setTUId: Setter<string>,
  chatInput: string, setChatInput: Setter<string>,
  chatBlocks: ChatContentType[], setChatBlocks: Setter<ChatContentType[]>,

  sockChatEmit: (event: string, payload: any) => void
}

// prettier-ignore
export const SingleChatContext = createContext<ContextType>({
  sockChat: null, setSockChat: () => {},
  cOId: '', setCOId: () => {},
  tUOId: '', setTUOId: () => {},
  tUId: '', setTUId: () => {},
  chatInput: '', setChatInput: () => {},
  chatBlocks: [], setChatBlocks: () => {},

  sockChatEmit: () => {}
})

type SingleChatProviderProps = {}

export const SingleChatProvider: FC<PropsWithChildren<SingleChatProviderProps>> = ({children}) => {
  const [sockChat, setSockChat] = useState<SocketType>(null)
  const [cOId, setCOId] = useState<string>('')
  const [tUOId, setTUOId] = useState<string>('')
  const [tUId, setTUId] = useState<string>('')
  const [chatInput, setChatInput] = useState<string>('')
  const [chatBlocks, setChatBlocks] = useState<ChatContentType[]>([])

  const {_id, jwt, refreshToken} = useAuth()
  const {socketPId} = useSocketContext()
  const {pageOId, setPageOId} = useLayoutContext()

  const location = useLocation()
  const lState = location.state as RowSingleChatRoomType

  const targetId = lState.targetId || ''
  const targetOId = lState.targetUOId || ''
  const chatRoomOId = lState.chatRoomOId || ''

  useSetCOId()
  useEffect(() => {
    if (!sockChat && jwt && _id && pageOId && socketPId) {
      const newSocket = io(serverUrl)
      setSockChat(newSocket)

      newSocket.on('chat connected', (payload: SocketChatConnectedType) => {
        console.log('CHAT CONNECTED : ', payload.cOId)
      })

      newSocket.on('chat', payload => {
        console.log('Chat received ', payload)
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

    // return () => {
    //   if (sockChat && sockChat.connected) {
    //     sockChat.disconnect()
    //     setSockChat(null)
    //   }
    // }
  }, [_id, jwt, pageOId, sockChat, socketPId, setPageOId, setSockChat])

  const sockChatEmit = useCallback(
    (event: string, payload: any) => {
      refreshToken()
      if (sockChat && sockChat.connected) {
        sockChat.emit(event, payload)
      }
    },
    [sockChat, refreshToken]
  )

  useEffect(() => {
    setCOId(chatRoomOId)
    setTUId(targetId)
    setTUOId(targetOId)
  }, [chatRoomOId, targetId, targetOId])

  // prettier-ignore
  const value = {
    sockChat, setSockChat,
    cOId, setCOId,
    tUOId, setTUOId,
    tUId, setTUId,
    chatInput, setChatInput,
    chatBlocks, setChatBlocks,
    sockChatEmit
  }
  return <SingleChatContext.Provider value={value} children={<SingleChatPage />} />
}

export const useSingleChatContext = () => {
  return useContext(SingleChatContext)
}

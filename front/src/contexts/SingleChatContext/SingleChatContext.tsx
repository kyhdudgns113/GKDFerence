import type {FC, PropsWithChildren} from 'react'
import {createContext, useCallback, useContext, useRef, useState} from 'react'

import {ChatBlocksType, ChatBlockType, DivRefType, Setter, SocketChatConnectedType, SocketChatContentType, SocketType} from '../../common'
import SingleChatPage from '../../pages/SingleChatPage/SingleChatPage'
import {useAuth} from '../AuthContext/AuthContext'

import * as H from './hooks'
import { useLayoutContext } from '../LayoutContext/LayoutContext'

// prettier-ignore
type ContextType = {
  sockChat: SocketType, setSockChat: Setter<SocketType>,
  cOId: string, setCOId: Setter<string>,
  tUOId: string, setTUOId: Setter<string>,
  tUId: string, setTUId: Setter<string>,
  chatInput: string, setChatInput: Setter<string>,
  chatBlocks: ChatBlockType[], setChatBlocks: Setter<ChatBlockType[]>,
  goToBot: boolean, setGoToBot: Setter<boolean>

  divChatsBodyRef: DivRefType

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
  goToBot: false, setGoToBot: () => {},

  divChatsBodyRef: null,

  sockChatEmit: () => {}
})

type SingleChatProviderProps = {}

export const SingleChatProvider: FC<PropsWithChildren<SingleChatProviderProps>> = ({children}) => {
  const [sockChat, setSockChat] = useState<SocketType>(null)
  const [cOId, setCOId] = useState<string>('')
  const [tUOId, setTUOId] = useState<string>('')
  const [tUId, setTUId] = useState<string>('')
  const [chatInput, setChatInput] = useState<string>('')
  const [chatBlocks, setChatBlocks] = useState<ChatBlocksType>([])
  const [chatQ, setChatQ] = useState<ChatBlocksType>([])
  const [isDBLoad, setIsDBLoad] = useState<boolean>(false)
  const [goToBot, setGoToBot] = useState<boolean>(false)

  const divChatsBodyRef = useRef<HTMLDivElement | null>(null)

  const {refreshToken} = useAuth()
  const {setChatRooms} = useLayoutContext()

  const onChatConnected = useCallback((newSocket: SocketType) => {
    if (newSocket) {
      newSocket.on('chat connected', (payload: SocketChatConnectedType) => {
        // console.log('CHAT CONNECTED : ', payload.cOId)
        setChatRooms(chatRooms =>
          chatRooms.map(chatRoom => {
            if (chatRoom.cOId === payload.cOId) {
              chatRoom.unreadChat = 0
            }
            return chatRoom
          })
        )
      })
    }
  }, [setChatRooms])

  const onChat = useCallback((newSocket: SocketType) => {
    if (newSocket) {
      newSocket.on('chat', (payload: SocketChatContentType) => {
        setChatQ(prev => [...prev, payload.body])
        if (divChatsBodyRef && divChatsBodyRef.current) {
          const {scrollTop, scrollHeight, clientHeight} = divChatsBodyRef.current
          if (scrollTop + clientHeight > scrollHeight) {
            setGoToBot(true)
          } 
        }
      })
    }
  }, [])

  H.useExecuteSetter(setCOId, setTUId, setTUOId, setIsDBLoad, setSockChat, setChatInput, setChatQ)
  H.useGetChatBlocksFromDB(cOId, isDBLoad, setChatBlocks, setIsDBLoad)
  H.useSetSockChat(sockChat, setSockChat, onChatConnected, onChat)
  H.useFromQToChatBlocks(chatQ, isDBLoad, setChatBlocks, setChatQ)
  H.useSetScrollBottom(chatBlocks, divChatsBodyRef, goToBot, setGoToBot)
  H.useExitSocketChat(sockChat, setSockChat)

  const sockChatEmit = useCallback(
    (event: string, payload: any) => {
      refreshToken()
      if (sockChat && sockChat.connected) {
        sockChat.emit(event, payload)
      }
    },
    [sockChat, refreshToken]
  )

  // prettier-ignore
  const value = {
    sockChat, setSockChat,
    cOId, setCOId,
    tUOId, setTUOId,
    tUId, setTUId,
    chatInput, setChatInput,
    chatBlocks, setChatBlocks,
    goToBot, setGoToBot,

    divChatsBodyRef,

    sockChatEmit
  }
  return <SingleChatContext.Provider value={value} children={<SingleChatPage />} />
}

export const useSingleChatContext = () => {
  return useContext(SingleChatContext)
}

import type {FC, PropsWithChildren} from 'react'
import {createContext, useCallback, useContext, useState} from 'react'

import {ChatBlocksType, ChatBlockType, Setter, SocketType} from '../../common'
import SingleChatPage from '../../pages/SingleChatPage/SingleChatPage'
import {useAuth} from '../AuthContext/AuthContext'

import * as H from './hooks'

// prettier-ignore
type ContextType = {
  sockChat: SocketType, setSockChat: Setter<SocketType>,
  cOId: string, setCOId: Setter<string>,
  tUOId: string, setTUOId: Setter<string>,
  tUId: string, setTUId: Setter<string>,
  chatInput: string, setChatInput: Setter<string>,
  chatBlocks: ChatBlockType[], setChatBlocks: Setter<ChatBlockType[]>,

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
  const [chatBlocks, setChatBlocks] = useState<ChatBlocksType>([])
  const [chatQ, setChatQ] = useState<ChatBlocksType>([])
  const [isDBLoad, setIsDBLoad] = useState<boolean>(false)

  const {uOId, refreshToken} = useAuth()

  H.useExecuteSetter(setCOId, setTUId, setTUOId, setIsDBLoad, setSockChat, setChatInput, setChatQ)
  H.useGetChatBlocksFromDB(cOId, isDBLoad, setChatBlocks, setIsDBLoad)
  H.useSetSockChat(sockChat, uOId, setSockChat, setChatQ)
  H.useFromQToChatBlocks(chatQ, isDBLoad, setChatBlocks, setChatQ)
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
    sockChatEmit
  }
  return <SingleChatContext.Provider value={value} children={<SingleChatPage />} />
}

export const useSingleChatContext = () => {
  return useContext(SingleChatContext)
}

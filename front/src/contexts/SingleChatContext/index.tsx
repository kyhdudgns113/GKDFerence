import type {Dispatch, FC, PropsWithChildren, SetStateAction} from 'react'
import {createContext, useCallback, useContext, useEffect, useState} from 'react'
import {Socket} from 'socket.io-client'
import {DefaultEventsMap} from 'socket.io/dist/typed-events'

import {ChatContentType, RowSingleChatRoomType} from '../../common'
import {useLocation} from 'react-router-dom'
import SingleChatPage from '../../pages/SingleChatPage'
import {useAuth} from '../AuthContext'

type SocketType = Socket<DefaultEventsMap, DefaultEventsMap> | null
type Setter<T> = Dispatch<SetStateAction<T>>

// prettier-ignore
type ContextType = {
  sockChat: SocketType, setSockChat: Setter<SocketType>,
  tUOId: string, setTUOId: Setter<string>,
  tUId: string, setTUId: Setter<string>,
  chatInput: string, setChatInput: Setter<string>,
  chatBlocks: ChatContentType[], setChatBlocks: Setter<ChatContentType[]>,

  sockChatEmit: (event: string, payload: any) => void
}

// prettier-ignore
export const SingleChatContext = createContext<ContextType>({
  sockChat: null, setSockChat: () => {},
  tUOId: '', setTUOId: () => {},
  tUId: '', setTUId: () => {},
  chatInput: '', setChatInput: () => {},
  chatBlocks: [], setChatBlocks: () => {},

  sockChatEmit: () => {}
})

type SingleChatProviderProps = {}

export const SingleChatProvider: FC<PropsWithChildren<SingleChatProviderProps>> = ({children}) => {
  const [sockChat, setSockChat] = useState<SocketType>(null)
  const [tUOId, setTUOId] = useState<string>('')
  const [tUId, setTUId] = useState<string>('')
  const [chatInput, setChatInput] = useState<string>('')
  const [chatBlocks, setChatBlocks] = useState<ChatContentType[]>([])

  const {refreshToken} = useAuth()

  const location = useLocation()
  const lState = location.state as RowSingleChatRoomType

  const targetId = lState.targetId || ''
  const targetOId = lState.targetUOId || ''

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
    setTUId(targetId)
    setTUOId(targetOId)
  }, [targetId, targetOId])

  // prettier-ignore
  const value = {
    sockChat, setSockChat,
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

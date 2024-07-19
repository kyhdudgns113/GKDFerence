import type {FC, PropsWithChildren} from 'react'
import {createContext, useCallback, useContext, useEffect, useState} from 'react'

import {
  ChatBlockType,
  Setter,
  SocketChatConnectedType,
  SocketChatContentType,
  SocketType
} from '../../common'
import SingleChatPage from '../../pages/SingleChatPage'
import {useAuth} from '../AuthContext'

import * as H from './hooks'
import {useLayoutContext} from '../LayoutContext'
import {useSocketContext} from '../SocketContext'
import {io} from 'socket.io-client'
import {serverUrl} from '../../client_secret'
import {get} from '../../server'

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
  const [chatBlocks, setChatBlocks] = useState<ChatBlockType[]>([])
  const [chatQ, setChatQ] = useState<ChatBlockType[]>([])
  const [isDBLoad, setIsDBLoad] = useState<boolean>(false)

  const {uOId, jwt, refreshToken} = useAuth()
  const {pageOId} = useLayoutContext()
  const {socketPId} = useSocketContext()

  // H.useGetChatDataFromDB()
  H.useExecuteSetter(setCOId, setTUId, setTUOId)
  H.useExitSocketChat(sockChat, setSockChat)

  useEffect(() => {
    if (jwt && cOId && !isDBLoad) {
      get(`/sidebar/chatRoom/getChatBlocks/${cOId}`, jwt)
        .then(res => res.json())
        .then(res => {
          const {ok, body, errors} = res
          if (ok) {
            const chatBlocks = body.chatBlocks
            setChatBlocks(chatBlocks)
            setIsDBLoad(true)
          } else {
            const keys = Object.keys(errors)
            alert(errors[keys[0]])
          }
        })
    }
  }, [jwt, isDBLoad, cOId])

  /**
   * Queue 에 쌓여있는걸 chatBlocks 로 옮기는 부분
   * db 에서 로드가 끝나지 않았으면 실행하지 않는다.
   */
  useEffect(() => {
    if (chatQ && chatQ.length > 0 && isDBLoad) {
      const newChatQ = [...chatQ]
      setChatBlocks(prev => [...prev, newChatQ.pop() as ChatBlockType])
      setChatQ(newChatQ)
    }
  }, [chatQ, isDBLoad])

  /**
   * sockChat 을 초기화 하는 부분
   */
  useEffect(() => {
    if (!sockChat && socketPId && pageOId) {
      alert('SockChatConnect')
      const newSocket = io(serverUrl)
      setSockChat(newSocket)

      newSocket.on('chat connected', (payload: SocketChatConnectedType) => {
        console.log('CHAT CONNECTED : ', payload.cOId)
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
  }, [uOId, jwt, pageOId, sockChat, socketPId, setSockChat, setChatQ])

  useEffect(() => {
    return () => {
      if (sockChat) {
        alert('SockChatEnd')
        sockChat.disconnect()
        setSockChat(null)
      }
    }
  }, [sockChat])

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

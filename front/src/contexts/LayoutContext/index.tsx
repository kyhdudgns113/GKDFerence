import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import {useToggle} from '../../hooks'
import {useSocketContext} from '../SocketContext'
import {LayoutModalProvider} from '../LayoutModalContext'
import {
  RowSingleChatRoomType,
  Setter,
  SocketSetUnreadChatType,
  SocketTestCountType
} from '../../common'

type ContextType = {
  testCnt?: number
  setTestCnt: Setter<number>

  showConf?: boolean
  setShowConf: Setter<boolean>
  showChat?: boolean
  setShowChat: Setter<boolean>
  showDoc?: boolean
  setShowDoc: Setter<boolean>

  chatRooms?: RowSingleChatRoomType[]
  setChatRooms: Setter<RowSingleChatRoomType[]>

  pageOId?: string
  setPageOId: Setter<string>
}

export const LayoutContext = createContext<ContextType>({
  setTestCnt: () => {},
  setShowConf: () => {},
  setShowChat: () => {},
  setShowDoc: () => {},
  setChatRooms: () => {},
  setPageOId: () => {}
})

type LayoutProviderProps = {}

/**
 * @param param0: Unused children
 * @returns Provider with "Layout" elements
 */
export const LayoutProvider: FC<PropsWithChildren<LayoutProviderProps>> = ({children}) => {
  const [testCnt, setTestCnt] = useState<number>(0)
  const [showConf, setShowConf] = useToggle()
  const [showChat, setShowChat] = useToggle()
  const [showDoc, setShowDoc] = useToggle()

  const [chatRooms, setChatRooms] = useState<RowSingleChatRoomType[]>([])

  const {addSocketPOn, socketPInit, socketPReset} = useSocketContext()

  const [pageOId, setPageOId] = useState<string>('')

  const callbackTestCount = useCallback((payload: SocketTestCountType) => {
    setTestCnt(payload.cnt)
  }, [])

  const callbackSetUnreadChat = useCallback((payload: SocketSetUnreadChatType) => {
    setChatRooms(chatRooms =>
      chatRooms.map(chatRoom => {
        if (chatRoom.cOId === payload.cOId) {
          chatRoom.unreadChat = payload.unreadChat
        }
        return chatRoom
      })
    )
  }, [])

  // NOTE: 소켓 초기화 하는곳
  useEffect(() => {
    socketPInit()
    addSocketPOn('test count', callbackTestCount)
    addSocketPOn('set unread chat', callbackSetUnreadChat)

    return () => {
      socketPReset()
    }
  }, [addSocketPOn, socketPInit, socketPReset, callbackTestCount, callbackSetUnreadChat])

  const value = {
    testCnt,
    setTestCnt,

    showConf,
    setShowConf,
    showChat,
    setShowChat,
    showDoc,
    setShowDoc,

    chatRooms,
    setChatRooms,

    pageOId,
    setPageOId
  }
  return <LayoutContext.Provider value={value} children={<LayoutModalProvider />} />
}

export const useLayoutContext = () => {
  return useContext(LayoutContext)
}

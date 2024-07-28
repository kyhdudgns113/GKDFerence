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
import {useSocketContext} from '../SocketContext/SocketContext'
import {LayoutModalProvider} from '../LayoutModalContext/LayoutModalContext'
import {
  RowDocumentGType,
  RowSingleChatRoomType,
  Setter,
  SocketSetUnreadChatType
} from '../../common'

type ContextType = {
  showConf?: boolean
  setShowConf: Setter<boolean>
  showChatRooms?: boolean
  setShowChatRooms: Setter<boolean>
  showDoc?: boolean
  setShowDoc: Setter<boolean>

  chatRooms?: RowSingleChatRoomType[]
  setChatRooms: Setter<RowSingleChatRoomType[]>
  documentGs?: RowDocumentGType[]
  setDocumentGs: Setter<RowDocumentGType[]>

  pageOId?: string
  setPageOId: Setter<string>
}

export const LayoutContext = createContext<ContextType>({
  setShowConf: () => {},
  setShowChatRooms: () => {},
  setShowDoc: () => {},

  setChatRooms: () => {},
  setDocumentGs: () => {},

  setPageOId: () => {}
})

type LayoutProviderProps = {}

/**
 * @param param0: Unused children
 * @returns Provider with "Layout" elements
 */
export const LayoutProvider: FC<PropsWithChildren<LayoutProviderProps>> = ({children}) => {
  const [showConf, setShowConf] = useToggle()
  const [showChatRooms, setShowChatRooms] = useToggle()
  const [showDoc, setShowDoc] = useToggle()

  const [chatRooms, setChatRooms] = useState<RowSingleChatRoomType[]>([])
  const [documentGs, setDocumentGs] = useState<RowDocumentGType[]>([])

  const {addSocketPOn, socketPInit, socketPReset} = useSocketContext()

  const [pageOId, setPageOId] = useState<string>('')

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
    addSocketPOn('set unread chat', callbackSetUnreadChat)

    return () => {
      socketPReset()
    }
  }, [addSocketPOn, socketPInit, socketPReset, callbackSetUnreadChat])

  const value = {
    showConf,
    setShowConf,
    showChatRooms,
    setShowChatRooms,
    showDoc,
    setShowDoc,

    chatRooms,
    setChatRooms,
    documentGs,
    setDocumentGs,

    pageOId,
    setPageOId
  }
  return <LayoutContext.Provider value={value} children={<LayoutModalProvider />} />
}

export const useLayoutContext = () => {
  return useContext(LayoutContext)
}

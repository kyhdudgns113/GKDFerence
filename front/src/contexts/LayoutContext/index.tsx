import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import {useToggle} from '../../hooks'
import {useSocketContext} from '../SocketContext'
import {LayoutModalProvider} from '../LayoutModalContext'
import {RowSingleChatRoomType, SocketTestCountType} from '../../common'

type ContextType = {
  testCnt?: number
  setTestCnt: Dispatch<SetStateAction<number>>

  showConf?: boolean
  setShowConf: Dispatch<SetStateAction<boolean>>
  showChat?: boolean
  setShowChat: Dispatch<SetStateAction<boolean>>
  showDoc?: boolean
  setShowDoc: Dispatch<SetStateAction<boolean>>

  chatRooms?: RowSingleChatRoomType[]
  setChatRooms: Dispatch<SetStateAction<RowSingleChatRoomType[]>>

  pageOId?: string
  setPageOId: Dispatch<SetStateAction<string>>
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

  const {socketP, addSocketOn, socketPInit, socketPReset} = useSocketContext()

  const [pageOId, setPageOId] = useState<string>('')

  const callbackTestCount = useCallback((payload: SocketTestCountType) => {
    setTestCnt(payload.cnt)
  }, [])

  // NOTE: 소켓 초기화 하는곳
  useEffect(() => {
    socketPInit()
    addSocketOn(socketP, 'test count', callbackTestCount)

    return () => {
      socketPReset()
    }
  }, [socketP, addSocketOn, socketPInit, socketPReset, callbackTestCount])

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

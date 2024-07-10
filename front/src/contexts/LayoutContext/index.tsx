import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react'
import {useToggle} from '../../hooks'
import {useSocketContext} from '../SocketContext'
import {SocketTestCountType} from '../SocketContext/types'
import {LayoutModalProvider} from '../LayoutModalContext'

type ContextType = {
  testCnt?: number
  setTestCnt: Dispatch<SetStateAction<number>>

  showConf?: boolean
  setShowConf: Dispatch<SetStateAction<boolean>>
  showChat?: boolean
  setShowChat: Dispatch<SetStateAction<boolean>>
  showDoc?: boolean
  setShowDoc: Dispatch<SetStateAction<boolean>>
}

export const LayoutContext = createContext<ContextType>({
  setTestCnt: () => {},
  setShowConf: () => {},
  setShowChat: () => {},
  setShowDoc: () => {}
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

  const {socketP, socketPInit, socketPReset} = useSocketContext()

  useEffect(() => {
    socketPInit()
    if (socketP) {
      socketP.on('test count', (payload: SocketTestCountType) => {
        setTestCnt(payload.cnt)
      })
    }

    return () => {
      socketPReset()
    }
  }, [socketP, socketPInit, socketPReset])

  const value = {
    testCnt,
    setTestCnt,

    showConf,
    setShowConf,
    showChat,
    setShowChat,
    showDoc,
    setShowDoc
  }
  return <LayoutContext.Provider value={value} children={<LayoutModalProvider />} />
}

export const useLayoutContext = () => {
  return useContext(LayoutContext)
}

import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState
} from 'react'
import {useToggle} from '../../hooks'

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

export const LayoutProvider: FC<PropsWithChildren<LayoutProviderProps>> = ({children}) => {
  const [testCnt, setTestCnt] = useState<number>(0)
  const [showConf, setShowConf] = useToggle()
  const [showChat, setShowChat] = useToggle()
  const [showDoc, setShowDoc] = useToggle()

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
  return <LayoutContext.Provider value={value} children={children} />
}

export const useLayoutContext = () => {
  return useContext(LayoutContext)
}

import type {FC, PropsWithChildren} from 'react'
import {createContext, useCallback, useContext, useState} from 'react'
import Layout from '../../routes/Layout'

type ContextType = {
  isCreateChatOpen: boolean
  onCreateChatOpen: () => void
  onCreateChatClose: () => void
}

export const LayoutModalContext = createContext<ContextType>({
  isCreateChatOpen: false,
  onCreateChatOpen: () => {},
  onCreateChatClose: () => {}
})

type LayoutModalProviderProps = {}

export const LayoutModalProvider: FC<PropsWithChildren<LayoutModalProviderProps>> = ({
  children
}) => {
  const [isCreateChatOpen, setCreateChatOpen] = useState<boolean>(false)

  const onCreateChatOpen = useCallback(() => {
    setCreateChatOpen(true)
  }, [setCreateChatOpen])
  const onCreateChatClose = useCallback(() => {
    setCreateChatOpen(false)
  }, [setCreateChatOpen])

  const value = {
    isCreateChatOpen,
    onCreateChatOpen,
    onCreateChatClose
  }
  return <LayoutModalContext.Provider value={value} children={<Layout />} />
}

export const useLayoutModalContext = () => {
  return useContext(LayoutModalContext)
}

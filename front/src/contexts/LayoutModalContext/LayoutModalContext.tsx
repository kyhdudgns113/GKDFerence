import type {FC, PropsWithChildren} from 'react'
import {createContext, useCallback, useContext, useState} from 'react'
import Layout from '../../routes/Layout'

type ContextType = {
  isTestOpen: boolean
  onTestOpen: () => void
  onTestClose: () => void
}

export const LayoutModalContext = createContext<ContextType>({
  isTestOpen: false,
  onTestOpen: () => {},
  onTestClose: () => {}
})

type LayoutModalProviderProps = {}

export const LayoutModalProvider: FC<PropsWithChildren<LayoutModalProviderProps>> = ({
  children
}) => {
  const [isTestOpen, setIsTestOpen] = useState<boolean>(false)

  const onTestOpen = useCallback(() => {
    setIsTestOpen(true)
  }, [setIsTestOpen])

  const onTestClose = useCallback(() => {
    setIsTestOpen(false)
  }, [setIsTestOpen])

  const value = {
    isTestOpen,
    onTestOpen,
    onTestClose
  }
  return <LayoutModalContext.Provider value={value} children={<Layout />} />
}

export const useLayoutModalContext = () => {
  return useContext(LayoutModalContext)
}

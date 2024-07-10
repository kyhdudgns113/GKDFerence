import type {FC, PropsWithChildren} from 'react'
import {createContext, useCallback, useContext, useState} from 'react' // eslint-disable-line
import Layout from '../../routes/Layout'

type ContextType = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const LayoutModalContext = createContext<ContextType>({
  isOpen: false,
  onOpen: () => {},
  onClose: () => {}
})

type LayoutModalProviderProps = {}

export const LayoutModalProvider: FC<PropsWithChildren<LayoutModalProviderProps>> = ({
  children
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const value = {
    isOpen,
    onOpen,
    onClose
  }
  return <LayoutModalContext.Provider value={value} children={<Layout />} />
}

export const useLayoutModalContext = () => {
  return useContext(LayoutModalContext)
}

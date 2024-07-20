import type {FC, PropsWithChildren} from 'react'
import {createContext, useContext} from 'react'

type ContextType = {
  testValue?: string
  testFunction: () => void
}

export const CopyMeContext = createContext<ContextType>({
  testFunction: () => {}
  //
})

type CopyMeProviderProps = {}

export const CopyMeProvider: FC<PropsWithChildren<CopyMeProviderProps>> = ({children}) => {
  const testValue = 'test'
  const testFunction = () => console.log('test function')

  const value = {
    testValue,
    testFunction
  }
  return <CopyMeContext.Provider value={value} children={children} />
}

export const useCopyMeContext = () => {
  return useContext(CopyMeContext)
}

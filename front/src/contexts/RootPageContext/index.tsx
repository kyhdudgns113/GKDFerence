import type {Dispatch, FC, PropsWithChildren, SetStateAction} from 'react'
import {createContext, useContext, useState} from 'react'
import RootPage from '../../pages/RootPage'

// prettier-ignore
type ContextType = {
  idVal: string, setIdVal: Dispatch<SetStateAction<string>>,
  pwVal: string, setPwVal: Dispatch<SetStateAction<string>>,
  idErr: string, setIdErr: Dispatch<SetStateAction<string>>,
  pwErr: string, setPwErr: Dispatch<SetStateAction<string>>,
}

// prettier-ignore
export const RootPageContext = createContext<ContextType>({
  idVal: '', setIdVal: () => {},
  pwVal: '', setPwVal: () => {},
  idErr: '', setIdErr: () => {},
  pwErr: '', setPwErr: () => {},
})

type RootPageProviderProps = {}

export const RootPageProvider: FC<PropsWithChildren<RootPageProviderProps>> = ({children}) => {
  const [idVal, setIdVal] = useState<string>('')
  const [pwVal, setPwVal] = useState<string>('')
  const [idErr, setIdErr] = useState<string>('')
  const [pwErr, setPwErr] = useState<string>('')

  // prettier-ignore
  const value = {
    idVal, setIdVal,
    pwVal, setPwVal,
    idErr, setIdErr,
    pwErr, setPwErr,
  }
  return <RootPageContext.Provider value={value} children={<RootPage />} />
}

export const useRootPageContext = () => {
  return useContext(RootPageContext)
}

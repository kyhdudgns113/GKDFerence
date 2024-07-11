import type {Dispatch, FC, PropsWithChildren, SetStateAction} from 'react'
import {createContext, useCallback, useContext, useState} from 'react'
import RootPage from '../../pages/RootPage'
import {useAuth} from '../AuthContext'
import {useNavigate} from 'react-router-dom'

// prettier-ignore
type ContextType = {
  idVal: string, setIdVal: Dispatch<SetStateAction<string>>,
  pwVal: string, setPwVal: Dispatch<SetStateAction<string>>,
  idErr: string, setIdErr: Dispatch<SetStateAction<string>>,
  pwErr: string, setPwErr: Dispatch<SetStateAction<string>>,
  onLogin: () => void
}

// prettier-ignore
export const RootPageContext = createContext<ContextType>({
  idVal: '', setIdVal: () => {},
  pwVal: '', setPwVal: () => {},
  idErr: '', setIdErr: () => {},
  pwErr: '', setPwErr: () => {},
  onLogin: () => {}
})

type RootPageProviderProps = {}

export const RootPageProvider: FC<PropsWithChildren<RootPageProviderProps>> = ({children}) => {
  const [idVal, setIdVal] = useState<string>('')
  const [pwVal, setPwVal] = useState<string>('')
  const [idErr, setIdErr] = useState<string>('')
  const [pwErr, setPwErr] = useState<string>('')

  const {login, refreshToken} = useAuth()
  const navigate = useNavigate()

  const onLogin = useCallback(() => {
    if (!idVal || !pwVal) {
      setIdErr(idVal ? '' : 'ID is empty')
      setPwErr(pwVal ? '' : 'PW is empty')
      return
    }
    login(idVal, pwVal)
      .then(_ => navigate('/main'))
      .catch(errors => {
        setIdErr(errors['idOrEmail'])
        setPwErr(errors['password'])
      })
  }, [idVal, pwVal, login, navigate])

  // prettier-ignore
  const value = {
    idVal, setIdVal,
    pwVal, setPwVal,
    idErr, setIdErr,
    pwErr, setPwErr,
    onLogin
  }
  return <RootPageContext.Provider value={value} children={<RootPage />} />
}

export const useRootPageContext = () => {
  return useContext(RootPageContext)
}

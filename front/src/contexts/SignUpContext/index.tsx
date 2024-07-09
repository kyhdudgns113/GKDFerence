import type {Dispatch, FC, PropsWithChildren, SetStateAction} from 'react'
import {createContext, useCallback, useContext, useState} from 'react'
import {useStateRow} from '../../pages/SignUpPage/hooks'
import {useAuth} from '../AuthContext'
import {useNavigate} from 'react-router-dom'
import SignUpPage from '../../pages/SignUpPage'

// prettier-ignore
type ContextType = {
  idVal: string, setIdVal: Dispatch<SetStateAction<string>>
  idErr: string, setIdErr: Dispatch<SetStateAction<string>>
  email: string, setEmail: Dispatch<SetStateAction<string>>
  emailErr: string, setEmailErr: Dispatch<SetStateAction<string>>
  pwVal: string, setPwVal: Dispatch<SetStateAction<string>>
  pwErr: string, setPwErr: Dispatch<SetStateAction<string>>
  pw2Val: string, setPw2Val: Dispatch<SetStateAction<string>>
  pw2Err: string, setPw2Err: Dispatch<SetStateAction<string>>
  submitLock: boolean, setSubmitLock: Dispatch<SetStateAction<boolean>>
  submitFunction: () => void
}

// prettier-ignore
export const SignUpContext = createContext<ContextType>({
  idVal: '', setIdVal: () => {},
  idErr: '', setIdErr: () => {},
  email: '', setEmail: () => {},
  emailErr: '', setEmailErr: () => {},
  pwVal: '', setPwVal: () => {},
  pwErr: '', setPwErr: () => {},
  pw2Val: '', setPw2Val: () => {},
  pw2Err: '', setPw2Err: () => {},
  submitLock: false, setSubmitLock: () => {},
  submitFunction: () => {}
})

type SignUpProviderProps = {}

/**
 * @param param0: Unused children
 * @returns Provider with "SignUpPage" elements
 */
export const SignUpProvider: FC<PropsWithChildren<SignUpProviderProps>> = ({children}) => {
  const [idVal, setIdVal, idErr, setIdErr] = useStateRow()
  const [email, setEmail, emailErr, setEmailErr] = useStateRow()
  const [pwVal, setPwVal, pwErr, setPwErr] = useStateRow()
  const [pw2Val, setPw2Val, pw2Err, setPw2Err] = useStateRow()
  const [submitLock, setSubmitLock] = useState<boolean>(false) //eslint-disable-line

  const {signup} = useAuth()
  const navigate = useNavigate()

  const submitFunction = useCallback(
    () => {
      if (!submitLock) {
        setSubmitLock(true)
        if (idErr) {
          alert(idErr)
        } else if (emailErr) {
          alert(emailErr)
        } else if (pwErr) {
          alert(pwErr)
        } else if (pw2Err) {
          alert(pw2Err)
        } else {
          signup(idVal, email, pwVal)
            .then(() => navigate('/'))
            .catch(errors => {
              const keys = Object.keys(errors)

              keys.includes('id') && setIdErr(errors['id'])
              keys.includes('email') && setEmailErr(errors['email'])
            })
        }
      }
    },
    // prettier-ignore
    [
      submitLock,
      idVal, idErr, email, emailErr,
      pwVal, pwErr, pw2Err,
      signup, navigate, setSubmitLock, setIdErr, setEmailErr
    ]
  )

  // prettier-ignore
  const value = {
    idVal, setIdVal, idErr, setIdErr,
    email, setEmail, emailErr, setEmailErr,
    pwVal, setPwVal, pwErr, setPwErr,
    pw2Val, setPw2Val, pw2Err, setPw2Err,
    submitLock, setSubmitLock,
    submitFunction
  }
  return <SignUpContext.Provider value={value} children={<SignUpPage />} />
}

export const useSignUpContext = () => {
  return useContext(SignUpContext)
}

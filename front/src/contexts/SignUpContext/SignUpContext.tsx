import type {FC, PropsWithChildren} from 'react'
import {createContext, useCallback, useContext, useState} from 'react'
import {useStateRow} from '../../pages/SignUpPage/hooks'
import {useAuth} from '../AuthContext/AuthContext'
import {useNavigate} from 'react-router-dom'
import SignUpPage from '../../pages/SignUpPage/SignUpPage'
import {Setter} from '../../common'

// prettier-ignore
type ContextType = {
  idVal: string, setIdVal: Setter<string>,
  idErr: string, setIdErr: Setter<string>,
  email: string, setEmail: Setter<string>,
  emailErr: string, setEmailErr: Setter<string>,
  pwVal: string, setPwVal: Setter<string>,
  pwErr: string, setPwErr: Setter<string>,
  pw2Val: string, setPw2Val: Setter<string>,
  pw2Err: string, setPw2Err: Setter<string>,
  submitLock: boolean, setSubmitLock: Setter<boolean>,
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
  const [submitLock, setSubmitLock] = useState<boolean>(false)

  const {signup} = useAuth()
  const navigate = useNavigate()

  const submitFunction = useCallback(
    () => {
      if (!submitLock) {
        setSubmitLock(true)
        if (idErr) {
          alert(idErr)
        } // BLANK LINE COMMENT:
        else if (emailErr) {
          alert(emailErr)
        } // BLANK LINE COMMENT:
        else if (pwErr) {
          alert(pwErr)
        } // BLANK LINE COMMENT:
        else if (pw2Err) {
          alert(pw2Err)
        } // BLANK LINE COMMENT:
        else {
          signup(idVal, email, pwVal)
            .then(() => navigate('/'))
            .catch(errors => {
              setIdErr(errors['id'])
              setEmailErr(errors['email'])
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

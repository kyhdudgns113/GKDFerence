import {classNameSignUpPage} from './className'
import {styleSignUpPage} from './style'
import {useSignUpContext} from '../../contexts'

import * as C from '../../components/SignUpPage'
import * as H from './hooks'

export default function SignUpPage() {
  const {className_main, className_centerElement} = classNameSignUpPage
  const {style_centerElemet} = styleSignUpPage

  // prettier-ignore
  const {
    idVal, setIdErr,
    email, setEmailErr,
    pwVal, setPwErr,
    pw2Val, setPw2Err,
    submitLock, setSubmitLock,
  } = useSignUpContext()

  H.useGoToMain()

  H.useCheckIdError(idVal, setIdErr)
  H.useCheckEmailError(email, setEmailErr)
  H.useCheckPWError(pwVal, setPwErr)
  H.useCheckPW2Error(pwVal, pw2Val, setPw2Err)

  H.useSubmitLock(submitLock, setSubmitLock)

  return (
    <div className={className_main}>
      <div className={className_centerElement} style={style_centerElemet}>
        <C.Title />
        <C.IDElement />
        <C.EmailElement />
        <C.PWElement />
        <C.PWCheckElement />
        <div className="flex flex-row justify-center mt-4">
          <C.SubmitButton />
          <div className="w-1/4"></div>
          <C.CancelButton />
        </div>
      </div>
    </div>
  )
}

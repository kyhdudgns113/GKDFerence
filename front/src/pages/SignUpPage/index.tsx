import {
  EmailElement,
  IDElement,
  PWCheckElement,
  PWElement,
  SubmitButton,
  CancelButton,
  Title
} from '../../components/SignUpPage'
import {classNameSignUpPage} from './className'
import {styleSignUpPage} from './style'
import {
  useCheckEmailError,
  useCheckIdError,
  useCheckPW2Error,
  useCheckPWError,
  useStateRow
} from './hooks'
import {MouseEvent, useCallback, useEffect} from 'react' //eslint-disable-line
import {useAuth} from '../../contexts/AuthContext'
import {useNavigate} from 'react-router-dom'

export default function SignUpPage() {
  const {className_main, className_centerElement} = classNameSignUpPage
  const {style_centerElemet} = styleSignUpPage

  const [idVal, setIdVal, idErr, setIdErr] = useStateRow()
  const [email, setEmail, emailErr, setEmailErr] = useStateRow()
  const [pwVal, setPwVal, pwErr, setPwErr] = useStateRow()
  const [pw2Val, setPw2Val, pw2Err, setPw2Err] = useStateRow()

  const {signup} = useAuth()

  const navigate = useNavigate()

  //  추후 Submit 버튼 적용해야됨
  useCheckIdError(idVal, setIdErr)
  useCheckEmailError(email, setEmailErr)
  useCheckPWError(pwVal, setPwErr)
  useCheckPW2Error(pwVal, pw2Val, setPw2Err)

  const onClickSubmit = useCallback(
    (e: MouseEvent) => {
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
    },
    // prettier-ignore
    [
      idVal, idErr, email, emailErr,
      pwVal, pwErr, pw2Err,
      signup, navigate, setIdErr, setEmailErr
    ]
  )

  // TODO: if jwt token validate, navigate to /main

  return (
    <div className={className_main}>
      <div className={className_centerElement} style={style_centerElemet}>
        <Title />
        <IDElement {...{idVal, setIdVal, idErr}} />
        <EmailElement {...{email, setEmail, emailErr}} />
        <PWElement {...{pwVal, setPwVal, pwErr}} />
        <PWCheckElement {...{pw2Val, setPw2Val, pw2Err}} />
        <div className="flex flex-row justify-center mt-4">
          <SubmitButton onClick={onClickSubmit} />
          <div className="w-1/4"></div>
          <CancelButton />
        </div>
      </div>
    </div>
  )
}

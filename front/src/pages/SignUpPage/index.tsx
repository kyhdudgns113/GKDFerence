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

export default function SignUpPage() {
  const {className_main, className_centerElement} = classNameSignUpPage
  const {style_centerElemet} = styleSignUpPage

  const [idVal, setIdVal, idErr, setIdErr] = useStateRow()
  const [email, setEmail, emailErr, setEmailErr] = useStateRow()
  const [pwVal, setPwVal, pwErr, setPwErr] = useStateRow()
  const [pw2Val, setPw2Val, pw2Err, setPw2Err] = useStateRow()

  //  추후 Submit 버튼 적용해야됨
  useCheckIdError(idVal, setIdErr)
  useCheckEmailError(email, setEmailErr)
  useCheckPWError(pwVal, setPwErr)
  useCheckPW2Error(pwVal, pw2Val, setPw2Err)

  const onClickTest = useCallback((e: MouseEvent) => {
    //
  }, [])

  return (
    <div className={className_main}>
      <div className={className_centerElement} style={style_centerElemet}>
        <Title />
        <IDElement {...{idVal, setIdVal, idErr}} />
        <EmailElement {...{email, setEmail, emailErr}} />
        <PWElement {...{pwVal, setPwVal, pwErr}} />
        <PWCheckElement {...{pw2Val, setPw2Val, pw2Err}} />
        <div className="flex flex-row justify-center mt-4">
          <SubmitButton />
          <button
            className="btn w-1/4 ml-2 mr-2 border-2 border-gkd-sakura-border"
            onClick={onClickTest}>
            Test
          </button>
          {/* <div className="w-1/4"></div> */}
          <CancelButton />
        </div>
      </div>
    </div>
  )
}

import {KeyboardEvent, MouseEvent, useCallback, useEffect, useState} from 'react' // eslint-disable-line

import {classNameRootPage} from './className'
import {styleRootPage} from './style'
import {
  ArgLoginButtonProps,
  IDElement,
  LoginButton,
  PWElement,
  SignUpButton,
  Title
} from '../../components/RootPage'

import * as U from '../../utils' // eslint-disable-line
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'
import {useGoToMain} from './hooks'

export default function RootPage() {
  const {className_main, className_centerElement} = classNameRootPage
  const {style_centerElemet} = styleRootPage

  /* eslint-disable */
  const [idVal, setIdVal] = useState<string>('')
  const [pwVal, setPwVal] = useState<string>('')
  const [idErr, setIdErr] = useState<string>('')
  const [pwErr, setPwErr] = useState<string>('')
  /* eslint-enable */

  const navigate = useNavigate() // eslint-disable-line

  const {login, logout, checkToken} = useAuth() // eslint-disable-line

  useGoToMain()

  const onKeyDownDivEnter = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        login(idVal, pwVal)
          .then(_ => navigate('/main'))
          .catch(errors => {
            setIdErr(errors['id'])
            setPwErr(errors['password'])
          })
      }
    },
    [idVal, pwVal, setIdErr, setPwErr, login, navigate]
  )

  const onClickTest = useCallback((e: MouseEvent) => {
    // For now, this is blank function
  }, [])

  const argLoginButton: ArgLoginButtonProps = {
    idVal,
    pwVal,
    setIdErr,
    setPwErr
  }
  return (
    <div className={className_main}>
      <div
        className={className_centerElement}
        onKeyDown={onKeyDownDivEnter}
        style={style_centerElemet}
        tabIndex={0}>
        <Title />
        <IDElement idVal={idVal} setIdVal={setIdVal} idErr={idErr} />
        <PWElement pwVal={pwVal} setPwVal={setPwVal} pwErr={pwErr} />
        <div className="flex flex-row justify-center mt-4">
          <LoginButton arg={argLoginButton} />
          <div className="btn w-1/4 border-2" onClick={onClickTest}>
            {' '}
          </div>
          <SignUpButton />
        </div>
      </div>
    </div>
  )
}

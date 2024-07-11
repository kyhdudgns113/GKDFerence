import {KeyboardEvent, MouseEvent, useCallback} from 'react' // eslint-disable-line
import {classNameRootPage} from './className'
import {styleRootPage} from './style'
import {IDElement, LoginButton, PWElement, SignUpButton, Title} from '../../components/RootPage'

import {useRootPageContext} from '../../contexts'
import {useGoToMain} from './hooks'

export default function RootPage() {
  const {className_main, className_centerElement} = classNameRootPage
  const {style_centerElemet} = styleRootPage

  const {onLogin} = useRootPageContext()

  useGoToMain()

  const onKeyDownDivEnter = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        onLogin()
      }
    },
    [onLogin]
  )

  const onClickTest = useCallback((e: MouseEvent) => {
    // For now, this is blank function
  }, [])

  return (
    <div className={className_main}>
      <div
        className={className_centerElement}
        onKeyDown={onKeyDownDivEnter}
        style={style_centerElemet}
        tabIndex={0}>
        <Title />
        <IDElement />
        <PWElement />
        <div className="flex flex-row justify-center mt-4">
          <LoginButton />
          <div className="btn w-1/4 border-2" onClick={onClickTest}>
            {' '}
          </div>
          <SignUpButton />
        </div>
      </div>
    </div>
  )
}

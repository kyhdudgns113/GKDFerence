import {useState} from 'react'

import {classNameRootPage} from './className'
import {styleRootPage} from './style'
import {
  IDElement,
  LoginButton,
  PWElement,
  SignUpButton,
  Title
} from '../../components/RootPage'

export default function RootPage() {
  const {className_main, className_centerElement} = classNameRootPage
  const {style_centerElemet} = styleRootPage

  const [idVal, setIdVal] = useState<string>('')
  const [pwVal, setPwVal] = useState<string>('')

  return (
    <div className={className_main}>
      <div className={className_centerElement} style={style_centerElemet}>
        <Title />
        <IDElement idVal={idVal} setIdVal={setIdVal} />
        <PWElement pwVal={pwVal} setPwVal={setPwVal} />
        <div className="flex flex-row justify-center mt-4">
          <LoginButton />
          <div className="w-1/4"> </div>
          <SignUpButton />
        </div>
      </div>
    </div>
  )
}

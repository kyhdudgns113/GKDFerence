import {Title} from '../../components/SignUpPage'
import {classNameSignUpPage} from './className'
import {styleSignUpPage} from './style'

export default function SignUpPage() {
  const {className_main, className_centerElement} = classNameSignUpPage
  const {style_centerElemet} = styleSignUpPage
  //
  return (
    <div className={className_main}>
      <div className={className_centerElement} style={style_centerElemet}>
        <Title />
        <div>ID</div>
        <div>Email</div>
        <div>PW</div>
        <div>PW_check</div>
        <div className="flex flex-row">
          <div className="m-4">SUButton</div>
          <div className="m-4">CancleButton</div>
        </div>
      </div>
    </div>
  )
}

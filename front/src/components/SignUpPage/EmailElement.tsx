import {FC} from 'react'
import {InputProps, RowInput} from '../Base/Inputs'
import {classNames} from './className'
import {ErrorLine} from './ErrorLine'
import {useSignUpContext} from '../../contexts'

export type EmailElementProps = InputProps & {}

export const EmailElement: FC<EmailElementProps> = ({className: _className, ...props}) => {
  const classNameToDiv = [_className].join(' ')
  const {classNameText} = classNames

  const {email, setEmail, emailErr} = useSignUpContext()

  return (
    <div className="flex flex-col">
      <RowInput
        className={classNameToDiv}
        classNameText={classNameText}
        inputType="text"
        val={email}
        setVal={setEmail}
        {...props}>
        EMAIL
      </RowInput>
      <div className="flex items-center justify-center h-4">
        {emailErr && <ErrorLine>{emailErr}</ErrorLine>}
      </div>
    </div>
  )
}

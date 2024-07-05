import {Dispatch, FC, SetStateAction} from 'react'
import {InputProps, RowInput} from '../Base/Inputs'
import {classNames} from './className'
import {ErrorLine} from './ErrorLine'

export type EmailElementProps = InputProps & {
  email: string
  setEmail: Dispatch<SetStateAction<string>>
  emailErr: string
}

export const EmailElement: FC<EmailElementProps> = ({
  email,
  setEmail,
  emailErr,
  className: _className,
  ...props
}) => {
  const classNameToDiv = [_className].join(' ')
  const {classNameText} = classNames

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

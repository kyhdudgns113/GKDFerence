import {FC} from 'react'
import {InputProps, RowInput} from '../Base/Inputs'
import {classNames} from './className'
import {ErrorLine} from './ErrorLine'
import {useSignUpContext} from '../../contexts/SignUpContext'

export type PWElementProps = InputProps & {
  //
}

export const PWElement: FC<PWElementProps> = ({className: _className, ...props}) => {
  const classNameToDiv = [_className].join(' ')
  const {classNameText} = classNames

  const {pwVal, setPwVal, pwErr} = useSignUpContext()

  return (
    <div className="flex flex-col">
      <RowInput
        className={classNameToDiv}
        classNameText={classNameText}
        inputType="password"
        setVal={setPwVal}
        val={pwVal}
        {...props}>
        PW
      </RowInput>
      <div className="flex items-center justify-center h-4">
        {pwErr && <ErrorLine>{pwErr}</ErrorLine>}
      </div>
    </div>
  )
}

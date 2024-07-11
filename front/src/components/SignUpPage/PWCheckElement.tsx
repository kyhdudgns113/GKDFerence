import {FC} from 'react'
import {InputProps, RowInput} from '../Base/Inputs'
import {classNames} from './className'
import {ErrorLine} from './ErrorLine'
import {useSignUpContext} from '../../contexts'

export type PWCheckElementProps = InputProps & {
  //
}

export const PWCheckElement: FC<PWCheckElementProps> = ({className: _className, ...props}) => {
  const classNameToDiv = [_className].join(' ')
  const {classNameText} = classNames

  const {pw2Val, setPw2Val, pw2Err} = useSignUpContext()

  return (
    <div className="flex flex-col">
      <RowInput
        className={classNameToDiv}
        classNameText={classNameText}
        inputType="password"
        setVal={setPw2Val}
        val={pw2Val}
        {...props}>
        PW2
      </RowInput>
      <div className="flex items-center justify-center h-4">
        {pw2Err && <ErrorLine>{pw2Err}</ErrorLine>}
      </div>
    </div>
  )
}

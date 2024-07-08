import {Dispatch, FC, SetStateAction} from 'react'
import {InputProps, RowInput} from '../Base/Inputs'
import {classNames} from './className'
import {ErrorLine} from './ErrorLine'

export type PWElementProps = InputProps & {
  pwVal: string
  setPwVal: Dispatch<SetStateAction<string>>
  pwErr: string
}

export const PWElement: FC<PWElementProps> = ({
  pwVal,
  setPwVal,
  pwErr,
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
        inputType="password"
        placeholder="password"
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

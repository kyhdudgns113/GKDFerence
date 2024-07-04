import {Dispatch, FC, SetStateAction} from 'react'
import {InputProps, RowInput} from '../Base/Inputs'

export type PWElementProps = InputProps & {
  pwVal: string
  setPwVal: Dispatch<SetStateAction<string>>
}

export const PWElement: FC<PWElementProps> = ({
  pwVal,
  setPwVal,
  className: _className,
  ...props
}) => {
  const classNameToDiv = [_className].join(' ')

  return (
    <RowInput
      className={classNameToDiv}
      inputType="password"
      placeholder="password"
      setVal={setPwVal}
      val={pwVal}
      {...props}>
      PW
    </RowInput>
  )
}

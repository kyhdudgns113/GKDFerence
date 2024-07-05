import {Dispatch, FC, SetStateAction} from 'react'
import {InputProps, RowInput} from '../Base/Inputs'

export type IDElementProps = InputProps & {
  idVal: string
  setIdVal: Dispatch<SetStateAction<string>>
}

export const IDElement: FC<IDElementProps> = ({
  idVal,
  setIdVal,
  className: _className,
  ...props
}) => {
  const classNameToDiv = [_className].join(' ')
  const classNameText = 'w-12'

  return (
    <RowInput
      className={classNameToDiv}
      classNameText={classNameText}
      inputType="text"
      placeholder="id or email"
      setVal={setIdVal}
      val={idVal}
      {...props}>
      ID
    </RowInput>
  )
}

import {Dispatch, FC, SetStateAction} from 'react'
import {InputProps, RowInput} from '../Base/Inputs'
import {ErrorLine} from './ErrorLine'
import {classNames} from './className'

export type IDElementProps = InputProps & {
  idVal: string
  setIdVal: Dispatch<SetStateAction<string>>

  idErr: string
}

export const IDElement: FC<IDElementProps> = ({
  idVal,
  setIdVal,
  idErr,
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
        placeholder="id or email"
        setVal={setIdVal}
        val={idVal}
        {...props}>
        ID
      </RowInput>
      <div className="flex items-center justify-center h-4">
        {idErr && <ErrorLine>{idErr}</ErrorLine>}
      </div>
    </div>
  )
}

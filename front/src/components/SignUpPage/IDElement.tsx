import {Dispatch, FC, SetStateAction} from 'react'
import {InputProps, RowInput} from '../Base/Inputs'
import {classNames} from './className'
import {ErrorLine} from './ErrorLine'

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

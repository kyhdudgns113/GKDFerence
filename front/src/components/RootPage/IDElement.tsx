import {FC} from 'react'
import {InputProps, RowInput} from '../Base/Inputs'
import {ErrorLine} from './ErrorLine'
import {classNames} from './className'
import {useRootPageContext} from '../../contexts/RootPageContext'

export type IDElementProps = InputProps & {
  //
}

export const IDElement: FC<IDElementProps> = ({
  //
  className: _className,
  ...props
}) => {
  const classNameToDiv = [_className].join(' ')
  const {classNameText} = classNames

  const {idVal, setIdVal, idErr} = useRootPageContext()

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

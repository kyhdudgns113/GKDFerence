import {FC} from 'react'
import {InputProps, RowInput} from '../../../components'
import {classNames} from './className'
import {ErrorLine} from './ErrorLine'
import {useSignUpContext} from '../../../contexts'

export type IDElementProps = InputProps & {
  //
}

export const IDElement: FC<IDElementProps> = ({className: _className, ...props}) => {
  const classNameToDiv = [_className].join(' ')
  const {classNameText} = classNames

  const {idVal, setIdVal, idErr} = useSignUpContext()

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

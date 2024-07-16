import {FC} from 'react'
import {InputProps, RowInput} from '../../../components'
import {ErrorLine} from './ErrorLine'
import {classNames} from './className'
import {useRootPageContext} from '../../../contexts'

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

  const {idVal, setIdVal, idErr, setIdErr} = useRootPageContext()

  return (
    <div className="flex flex-col" onChange={e => setIdErr('')}>
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

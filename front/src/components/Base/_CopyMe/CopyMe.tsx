import {FC} from 'react'
import {DivCommonProps} from '../Props'

export type CopyMeType = DivCommonProps & {
  //
}

export const CopyMe: FC<CopyMeType> = ({className: _className, ...props}) => {
  const className = [
    '', //
    _className
  ].join(' ')

  return (
    <div className={className}>
      <div>CopyMe</div>
    </div>
  )
}

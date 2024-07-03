import {FC} from 'react'
import {TextProps} from './props'

export const _SM: FC<TextProps> = ({className: _className, ...props}) => {
  const className = [
    'text-gkd-sakura-text', //
    'text-sm', //
    _className
  ].join(' ')

  return <p {...props} className={className} />
}

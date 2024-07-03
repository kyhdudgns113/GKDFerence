import {FC} from 'react'
import {TextProps} from './props'

export const _XS: FC<TextProps> = ({className: _className, ...props}) => {
  const className = [
    'text-gkd-sakura-text', //
    'text-XS', //
    _className
  ].join(' ')

  return <p {...props} className={className} />
}

import {FC} from 'react'
import {TextProps} from './props'

export const _9XL: FC<TextProps> = ({className: _className, ...props}) => {
  const className = [
    'text-gkd-sakura-text', //
    'text-9xl', //
    _className
  ].join(' ')

  return <p {...props} className={className} />
}

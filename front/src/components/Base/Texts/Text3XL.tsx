import {FC} from 'react'
import {TextProps} from './props'

export const Text3XL: FC<TextProps> = ({className: _className, ...props}) => {
  const className = [
    'text-gkd-sakura-text', //
    'text-3xl', //
    _className
  ].join(' ')

  return <p {...props} className={className} />
}

import {FC} from 'react'
import {TextProps} from './props'

export const Text2XL: FC<TextProps> = ({className: _className, ...props}) => {
  const className = [
    'text-gkd-sakura-text', //
    'text-2xl', //
    _className
  ].join(' ')

  return <p {...props} className={className} />
}

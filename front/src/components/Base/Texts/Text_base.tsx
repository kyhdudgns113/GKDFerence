import {FC} from 'react'
import {TextProps} from './props'

export const Text_base: FC<TextProps> = ({className: _className, ...props}) => {
  const className = [
    'text-gkd-sakura-text', //
    'text-base', //
    _className
  ].join(' ')

  return <p {...props} className={className} />
}

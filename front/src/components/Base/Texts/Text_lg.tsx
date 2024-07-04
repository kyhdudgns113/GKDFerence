import {FC} from 'react'
import {TextProps} from './props'

export const Text_lg: FC<TextProps> = ({className: _className, ...props}) => {
  const className = [
    'text-gkd-sakura-text', //
    'text-lg', //
    _className
  ].join(' ')

  return <p {...props} className={className} />
}

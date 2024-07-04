import {FC} from 'react'
import {TextProps} from './props'

export const Text_xl: FC<TextProps> = ({className: _className, ...props}) => {
  const className = [
    'text-gkd-sakura-text', //
    'text-xl', //
    _className
  ].join(' ')

  return <p {...props} className={className} />
}

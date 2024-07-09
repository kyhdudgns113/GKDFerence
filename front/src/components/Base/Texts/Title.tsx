import * as T from '.'
import {FC} from 'react'

export const Title: FC<T.TextProps> = ({className: _className, ...props}) => {
  const className = [
    'font-bold', //
    _className
  ].join(' ')

  return <T.Text5XL className={className} {...props} />
}

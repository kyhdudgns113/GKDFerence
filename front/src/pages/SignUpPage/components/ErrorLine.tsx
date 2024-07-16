import {FC} from 'react'

import * as T from '../../../components'

export type ErrorLineProps = T.TextProps & {}

export const ErrorLine: FC<ErrorLineProps> = ({className: _className, ...props}) => {
  const className = [
    'text-red-500',
    'text-sm', //
    'font-bold',
    _className
  ].join(' ')

  return <p className={className} {...props} />
}

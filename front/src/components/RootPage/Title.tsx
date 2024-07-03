import * as TEXT from '../texts'
import {FC} from 'react'

export const Title: FC<TEXT.TextProps> = ({className: _className, ...props}) => {
  const className = ['font-bold', _className].join(' ')

  return <TEXT._5XL className={className}>GKDFerence</TEXT._5XL>
}

import {FC} from 'react'
import {DivPropsCommon, className_DivCommon} from './common'
import {Icon} from '../../Base/Icons'

import {Text} from './Text'

export type LogoutProps = DivPropsCommon & {}

export const Logout: FC<LogoutProps> = ({className: _className, ...props}) => {
  const className = [
    className_DivCommon, //
    _className
  ].join(' ')

  return (
    <div className={className} {...props}>
      <Icon className="text-3xl" name="logout"></Icon>
      <Text>Log Out</Text>
    </div>
  )
}

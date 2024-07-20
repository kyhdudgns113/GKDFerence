import {FC} from 'react'
import {DivPropsCommon, className_DivCommon} from './common'
import {Icon} from '../../../../components/Base'

import {Text} from './Text'

export type MyAccountProps = DivPropsCommon & {}

export const MyAccount: FC<MyAccountProps> = ({className: _className, ...props}) => {
  const className = [
    className_DivCommon, //
    _className
  ].join(' ')

  return (
    <div className={className} {...props}>
      <Icon className="text-3xl" name="account_circle"></Icon>
      <Text>My Account</Text>
    </div>
  )
}

import {FC} from 'react'
import {DivPropsCommon, className_DivCommon} from './common'
import {Icon} from '../../../../components/Base'

import {Text} from './Text'
import {useAuth} from '../../../../contexts'
import {useNavigate} from 'react-router-dom'

export type LogoutProps = DivPropsCommon & {}

export const Logout: FC<LogoutProps> = ({className: _className, ...props}) => {
  const className = [
    className_DivCommon, //
    _className
  ].join(' ')

  const {logout} = useAuth()
  const navigate = useNavigate()

  return (
    <div
      className={className}
      {...props}
      onClick={e => {
        logout(() => navigate('/'))
      }}>
      <Icon className="text-3xl" name="logout"></Icon>
      <Text>Log Out</Text>
    </div>
  )
}

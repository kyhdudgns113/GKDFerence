import {FC} from 'react'
import {useNavigate} from 'react-router-dom'

import {className_DivCommon} from './common'
import {Icon} from '../../Base/Icons'
import {DivPropsCommon} from './common'
import {Text} from './Text'

export type HomeProps = DivPropsCommon

export const Home: FC<HomeProps> = ({className: _className, ...props}) => {
  const className = [
    className_DivCommon, //
    _className
  ].join(' ')

  const navigate = useNavigate()

  return (
    <div {...props} className={className} onClick={e => navigate('/main')}>
      <Icon className="text-3xl" name="home"></Icon>
      <Text>Home</Text>
    </div>
  )
}

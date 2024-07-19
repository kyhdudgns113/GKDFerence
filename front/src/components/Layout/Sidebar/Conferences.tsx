import {FC} from 'react'
import {DivCommonProps, Icon} from '../../Base'
import {useLayoutContext} from '../../../contexts'
import {Text} from '../Header'
import {classNameRowTitle} from './className'

export type ConferencesProps = DivCommonProps & {
  //
}

export const Conferences: FC<ConferencesProps> = () => {
  const {showConf, setShowConf} = useLayoutContext() // eslint-disable-line

  return (
    <div className="flex flex-col">
      <div
        className={classNameRowTitle}
        onClick={e => {
          setShowConf(prev => !prev)
        }}
        style={{userSelect: 'none'}}>
        <Text>&nbsp;&nbsp;Conferences</Text>
        <Icon className="text-3xl" name={showConf ? 'arrow_drop_down' : 'arrow_right'}></Icon>
      </div>
    </div>
  )
}

import {FC} from 'react'
import {DivCommonProps, Icon} from '../../Base'
import {useLayoutContext} from '../../../contexts/LayoutContext'
import {Text} from '../Header'
import {classNameRowTitle} from './className'

export type ConferenceListProps = DivCommonProps & {
  //
}

export const ConferenceList: FC<ConferenceListProps> = () => {
  const {showConf, setShowConf} = useLayoutContext() // eslint-disable-line

  return (
    <div className="flex flex-col">
      <div
        className={classNameRowTitle}
        onClick={e => {
          setShowConf(prev => !prev)
        }}
        style={{userSelect: 'none'}}>
        <Text>&nbsp;&nbsp;Conference List</Text>
        <Icon className="text-3xl" name={showConf ? 'arrow_drop_down' : 'arrow_right'}></Icon>
      </div>
    </div>
  )
}

import {FC} from 'react'
import {DivCommonProps, Icon} from '../../Base'
import {useLayoutContext} from '../../../contexts'
import {Text} from '../Header'
import {classNameRowTitle} from './className'

export type ChattingListProps = DivCommonProps & {
  //
}

export const ChattingList: FC<ChattingListProps> = () => {
  const {showChat, setShowChat} = useLayoutContext() // eslint-disable-line

  return (
    <div className="flex flex-col">
      <div
        className={classNameRowTitle}
        onClick={e => {
          setShowChat(prev => !prev)
        }}
        style={{userSelect: 'none'}}>
        <Text>&nbsp;&nbsp;Chatting List</Text>
        <Icon className="text-3xl" name={showChat ? 'arrow_drop_down' : 'arrow_right'}></Icon>
      </div>
    </div>
  )
}

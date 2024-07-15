import {FC} from 'react'
import {DivCommonProps, Icon} from '../../Base'
import {useLayoutContext} from '../../../contexts'
import {Text} from '../Header'
import {classNameRowTitle} from './className'

import * as T from '../../Base/Texts'

export type ChattingListProps = DivCommonProps & {
  //
}

export const ChattingList: FC<ChattingListProps> = () => {
  const {showChat, setShowChat, chatRooms, setPageOId} = useLayoutContext() // eslint-disable-line

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
      {/* // TODO: 여기 해야돼. */}
      {showChat && (
        <div className="mt-2">
          {chatRooms?.map(row => {
            return (
              <a
                className="pl-8 pt-1 pb-1 flex flex-row cursor-pointer hover:bg-gkd-sakura-bg-70"
                href={`/main/sc/${row.chatRoomOId}`}
                key={`chatRow:${row.chatRoomOId}`}
                onClick={e => setPageOId(row.chatRoomOId)}>
                <Icon name="chat" className="flex items-center text-xl" />
                <T.TextXL className="flex items-center ml-2">{row.targetId}</T.TextXL>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}

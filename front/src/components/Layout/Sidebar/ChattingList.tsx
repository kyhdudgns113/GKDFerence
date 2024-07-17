import {FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps, Icon} from '../../Base'
import {useLayoutContext} from '../../../contexts'
import {Text} from '../Header'
import {classNameRowTitle} from './className'

import * as T from '../../Base/Texts'
import {useNavigate} from 'react-router-dom'
import {RowSingleChatRoomType} from '../../../common'

export type ChattingListProps = DivCommonProps & {
  //
}

export const ChattingList: FC<ChattingListProps> = () => {
  const {showChat, setShowChat, chatRooms, setPageOId} = useLayoutContext() // eslint-disable-line
  const navigate = useNavigate()

  const onClickChatRoom = useCallback(
    (row: RowSingleChatRoomType) => (e: MouseEvent) => {
      e.stopPropagation()
      setPageOId(row.chatRoomOId)
      navigate(`/main/sc`, {
        state: {chatRoomOId: row.chatRoomOId, targetId: row.targetId, targetUOId: row.targetUOId}
      })
    },
    [navigate, setPageOId]
  )

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
              <div
                className="pl-8 pt-1 pb-1 flex flex-row cursor-pointer hover:bg-gkd-sakura-bg-70"
                key={`chatRow:${row.chatRoomOId}`}
                onClick={onClickChatRoom(row)}>
                <Icon name="chat" className="flex items-center text-xl" />
                <T.TextXL className="flex items-center ml-2">{row.targetId}</T.TextXL>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

import {FC, MouseEvent, useCallback} from 'react'
import {DivCommonProps, Icon} from '../../Base'
import {useLayoutContext} from '../../../contexts'
import {Text} from '../Header'
import {classNameRowTitle} from './className'

import * as T from '../../Base/Texts'
import {useNavigate} from 'react-router-dom'
import {RowSingleChatRoomType} from '../../../common'

export type ChatRoomsProps = DivCommonProps & {
  //
}

export const ChatRooms: FC<ChatRoomsProps> = () => {
  const {showChat, setShowChat, chatRooms} = useLayoutContext()
  const navigate = useNavigate()

  const onClickChatRoom = useCallback(
    (row: RowSingleChatRoomType) => (e: MouseEvent) => {
      e.stopPropagation()
      navigate(`/main/sc`, {
        state: {cOId: row.cOId, tUId: row.tUId, tUOId: row.tUOId}
      })
    },
    [navigate]
  )

  return (
    <div className="flex flex-col">
      <div
        className={classNameRowTitle}
        onClick={e => {
          setShowChat(prev => !prev)
        }}
        style={{userSelect: 'none'}}>
        <Text>&nbsp;&nbsp;Chat Rooms</Text>
        <Icon className="text-3xl" name={showChat ? 'arrow_drop_down' : 'arrow_right'}></Icon>
      </div>
      {showChat && (
        <div className="mt-2">
          {chatRooms?.map(row => {
            return (
              <div
                className="pl-8 pt-1 pb-1 flex flex-row cursor-pointer hover:bg-gkd-sakura-bg-70"
                key={`chatRow:${row.cOId}`}
                onClick={onClickChatRoom(row)}>
                <Icon name="chat" className="flex items-center text-xl" />
                <T.TextXL className="flex items-center ml-2">{row.tUId}</T.TextXL>
                <p className="ml-auto">1</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

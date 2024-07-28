import {FC, MouseEvent, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'

import {DivCommonProps, Icon} from '../../../../components/Base'
import {useLayoutContext} from '../../../../contexts'
import {Text} from '../../Header/components'
import {classNameRowTitle} from './className'

import * as T from '../../../../components/Base/Texts'
import {RowSingleChatRoomType} from '../../../../common'

export type ChatRoomsProps = DivCommonProps & {
  //
}

export const ChatRooms: FC<ChatRoomsProps> = () => {
  const {showChatRooms, setShowChatRooms, chatRooms} = useLayoutContext()
  const navigate = useNavigate()

  const onClickChatRoom = useCallback(
    (row: RowSingleChatRoomType) => (e: MouseEvent) => {
      e.stopPropagation()
      navigate(`/main/sc/${row.cOId}`, {
        state: {cOId: row.cOId, tUId: row.tUId, tUOId: row.tUOId}
      })
    },
    [navigate]
  )

  return (
    <div className="flex flex-col">
      <div className={classNameRowTitle} onClick={e => setShowChatRooms(prev => !prev)}>
        <Text>&nbsp;&nbsp;Chats</Text>
        <Icon className="text-3xl" name={showChatRooms ? 'arrow_drop_down' : 'arrow_right'}></Icon>
      </div>
      {showChatRooms && (
        <div className="mt-2">
          {chatRooms?.map(row => {
            return (
              <div
                className="pl-8 pt-1 pb-1 select-none flex flex-row cursor-pointer hover:bg-gkd-sakura-bg-70 items-center"
                key={`chatRow:${row.cOId}`}
                onClick={onClickChatRoom(row)}>
                <Icon name="chat" className="flex items-center text-xl" />
                <T.TextXL className="flex items-center ml-2">{row.tUId}</T.TextXL>
                {row.unreadChat > 0 && (
                  <div className="flex items-center pl-2 pr-2 rounded-lg bg-gkd-sakura-text ml-auto mr-2 text-gkd-sakura-bg">
                    {row.unreadChat}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

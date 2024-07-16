import {Socket} from 'socket.io-client'
import {DefaultEventsMap} from 'socket.io/dist/typed-events'

import {Button, Title} from '../../components'
import {useSetCOId, useSetSockChat, useSetTargetUserOId} from './hooks'
import {useCallback, useState} from 'react'
import {useLocation} from 'react-router-dom'
import {useAuth} from '../../contexts'
import {ChatContentType} from '../../common'
import {ChatBlockMy, ChatBlockOther} from './components'

// FUTURE: cOId, tUOId, targetID 중 하나라도 없으면 아무것도 띄우지 말자.
export default function SingleChatPage() {
  const [sockChat, setSockChat] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null)
  const [tUOId, setTUOId] = useState<string>('')
  const [chatInput, setChatInput] = useState<string>('')
  const [chatBlocks, setChatBlocks] = useState<ChatContentType[]>([])

  const {id, _id} = useAuth()

  const location = useLocation()
  const targetId = location.state?.targetId || ''

  useSetCOId()
  useSetSockChat(sockChat, setSockChat)
  useSetTargetUserOId(tUOId, setTUOId)

  const onClickSend = useCallback(() => {
    const chatBlock: ChatContentType = {
      id: id || '',
      _id: _id || '',
      content: chatInput
    }
    if (chatInput) {
      setChatBlocks(prev => [...prev, chatBlock])
    }
    setChatInput('')
  }, [id, _id, chatInput])

  return (
    <div className="mt-2 mb-2 flex flex-col items-center h-full">
      <Title className="mb-4">Chat Page : {targetId}</Title>
      <div className="flex flex-col w-1/3 h-full border-2 border-gkd-sakura-border">
        <div className="DIV_CHATS flex flex-col w-full h-full bg-gkd-sakura-bg/70">
          {chatBlocks.map((chatBlock, index) => {
            if (chatBlock._id === _id) {
              return <ChatBlockMy chatBlock={chatBlock} index={index} />
            } else {
              return <ChatBlockOther chatBlock={chatBlock} index={index} />
            }
          })}
        </div>
        <div className="DIV_INPUT flex flex-row w-full h-12 bg-white">
          <textarea
            className="p-4 w-full resize-none border-2 border-gkd-sakura-border"
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => {
              switch (e.key) {
                case 'Enter':
                  e.preventDefault()
                  if (e.altKey) {
                    setChatInput(prev => prev + '\n')
                  } else {
                    onClickSend()
                  }
                  break
              }
            }}
            value={chatInput}
          />
          <Button className="" onClick={e => onClickSend()}>
            send
          </Button>
        </div>
      </div>
    </div>
  )
}

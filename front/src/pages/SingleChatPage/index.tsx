import {Socket} from 'socket.io-client'
import {DefaultEventsMap} from 'socket.io/dist/typed-events'

import {Button, Title} from '../../components'
import {useSetCOId, useSetSockChat, useSetTargetUserOId} from './hooks'
import {useState} from 'react'
import {useLocation} from 'react-router-dom'
import {useAuth} from '../../contexts'

type ChatBlockType = {
  id: string
  _id: string
  date: Date
  contents: string
}

// FUTURE: cOId, tUOId, targetID 중 하나라도 없으면 아무것도 띄우지 말자.
export default function SingleChatPage() {
  const [sockChat, setSockChat] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null)
  const [tUOId, setTUOId] = useState<string>('')
  const [chatInput, setChatInput] = useState<string>('')
  const [chatBlocks, setChatBlocks] = useState<ChatBlockType[]>([]) // eslint-disable-line

  const {id, _id} = useAuth() // eslint-disable-line

  const location = useLocation()
  const targetId = location.state?.targetId || ''

  useSetCOId()
  useSetSockChat(sockChat, setSockChat)
  useSetTargetUserOId(tUOId, setTUOId)

  return (
    <div className="mt-2 mb-2 flex flex-col items-center h-full">
      <Title className="mb-4">Chat Page : {targetId}</Title>
      <div className="flex flex-col w-1/3 h-full border-2 border-gkd-sakura-border">
        <div className="DIV_CHATS flex flex-col w-full h-full bg-gkd-sakura-bg/70">
          {chatBlocks.map(chatBlock => {
            return <div>{chatBlock.contents}</div>
          })}
        </div>
        <div className="DIV_INPUT flex flex-row w-full h-12 bg-white">
          <input
            className="pl-4 pr-2 w-full"
            onChange={e => setChatInput(e.target.value)}
            placeholder="text"
            type="text"
            value={chatInput}
          />
          <Button
            className=""
            onClick={e => {
              const chatBlock: ChatBlockType = {
                id: id || '',
                _id: _id || '',
                date: new Date(),
                contents: chatInput
              }
              if (chatInput) {
                setChatBlocks(prev => [...prev, chatBlock])
              }
              setChatInput('')
            }}>
            send
          </Button>
        </div>
      </div>
    </div>
  )
}

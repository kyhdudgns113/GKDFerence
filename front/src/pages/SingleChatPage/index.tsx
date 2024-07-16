import {Socket} from 'socket.io-client'
import {DefaultEventsMap} from 'socket.io/dist/typed-events'

import {Title} from '../../components'
import {useSetCOId, useSetSockChat, useSetTargetUserOId} from './hooks'
import {useState} from 'react'
import {useLocation} from 'react-router-dom'

// FUTURE: cOId, tUOId, targetID 중 하나라도 없으면 아무것도 띄우지 말자.
export default function SingleChatPage() {
  const [sockChat, setSockChat] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null)
  const [tUOId, setTUOId] = useState<string>('')

  const location = useLocation()
  const targetId = location.state?.targetId || ''

  useSetCOId()
  useSetSockChat(sockChat, setSockChat)
  useSetTargetUserOId(tUOId, setTUOId)

  return (
    <div className="mt-2 mb-2 flex flex-col items-center h-full">
      <Title className="mb-4">Chat Page : {targetId}</Title>
      <div className="flex flex-col w-1/3 h-full border-2 border-gkd-sakura-border">
        <div className="flex w-full h-full bg-gkd-sakura-bg/70"></div>
        <div className="flex w-full h-12 bg-white"></div>
      </div>
    </div>
  )
}

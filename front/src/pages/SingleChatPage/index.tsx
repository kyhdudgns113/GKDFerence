import {Title} from '../../components'
import {useAuth} from '../../contexts'
import {ChatBlockMy, ChatBlockOther, InputArea} from './components'
import {useSingleChatContext} from '../../contexts/SingleChatContext'

// FUTURE: cOId, tUOId, targetID 중 하나라도 없으면 아무것도 띄우지 말자.
export default function SingleChatPage() {
  /* eslint-disable */
  const {
    sockChat,
    setSockChat,
    tUId,
    tUOId,
    setTUOId,
    chatInput,
    setChatInput,
    chatBlocks,
    setChatBlocks
  } = useSingleChatContext()
  const {id, _id} = useAuth()
  /* eslint-enable */

  return (
    <div className="mt-2 mb-2 flex flex-col items-center h-full">
      <Title className="mb-4">Chat Page : {tUId}</Title>
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
        <InputArea />
      </div>
    </div>
  )
}

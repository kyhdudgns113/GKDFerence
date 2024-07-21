import {Button, Title} from '../../components'
import {useAuth} from '../../contexts'
import {ChatBlockMy, ChatBlockOther, InputArea} from './components'
import {useSingleChatContext} from '../../contexts/SingleChatContext/SingleChatContext'
import {get} from '../../server'

// FUTURE: cOId, tUOId, targetID 중 하나라도 없으면 아무것도 띄우지 말자.
export default function SingleChatPage() {
  const {
    chatBlocks,
    cOId,
    divChatsBodyRef,
    tUId,
    scrollYVal,
    setScrollYVal,
    setScrollYMax,
    setChatBlocks
  } = useSingleChatContext()
  const {uOId, jwt} = useAuth()

  return (
    <div className="mt-2 mb-2 flex flex-col items-center h-full ">
      <Title className="mb-4">Chat Page : {tUId}</Title>
      <div className="DIV_3BODY flex flex-row w-full h-[800px]">
        <div className="DIV_LEFT_BODY w-1/3 h-full">
          <p>&nbsp;</p>
        </div>
        {/* CENTER BODY START */}
        <div className="DIV_CENTER_BODY sticky flex flex-col w-1/3 h-full border-2 border-gkd-sakura-border">
          {scrollYVal === 0 &&
            chatBlocks.length > 0 &&
            chatBlocks[0].idx !== undefined &&
            chatBlocks[0].idx > 0 && (
              <div
                className="absolute flex justify-center w-full h-fit bg-black/30 z-20 cursor-pointer select-none"
                onClick={e => {
                  get(`/sidebar/chatRoom/getChatBlocks/${cOId}/${chatBlocks[0].idx ?? 0}`, jwt)
                    .then(res => res.json())
                    .then(res => {
                      const {ok, body} = res
                      if (ok) {
                        setChatBlocks(prev => [...body.chatBlocks, ...prev])
                      }
                    })
                }}>
                <p>이전 메시지 불러오기</p>
              </div>
            )}

          <div
            className="DIV_CHATS flex flex-col w-full h-full bg-gkd-sakura-bg/70 overflow-y-scroll"
            onScroll={e => {
              setScrollYVal(divChatsBodyRef?.current?.scrollTop || 0)
              setScrollYMax(divChatsBodyRef?.current?.scrollHeight || 0)
            }}
            ref={divChatsBodyRef}>
            {chatBlocks.map(chatBlock => {
              if (chatBlock.uOId === uOId) {
                return (
                  <div key={`chat:${chatBlock.idx}`}>
                    <ChatBlockMy chatBlock={chatBlock} index={chatBlock.idx || 0} />
                  </div>
                )
              } else {
                return (
                  <div key={`chat:${chatBlock.idx}`}>
                    <ChatBlockOther chatBlock={chatBlock} index={chatBlock.idx || 0} />
                  </div>
                )
              }
            })}
          </div>
          <InputArea />
        </div>
        {/* CENTER BODY END */}
        <div className="DIV_RIGHT_BODY flex items-center justify-center w-1/3 h-full">
          <Button
            className="m-2"
            onClick={e => {
              if (divChatsBodyRef?.current) {
                divChatsBodyRef.current.scrollTop = divChatsBodyRef.current.scrollHeight
              }
            }}>
            Test 1
          </Button>
        </div>
      </div>
    </div>
  )
}

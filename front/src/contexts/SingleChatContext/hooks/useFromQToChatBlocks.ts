import {useEffect} from 'react'
import {ChatBlocksType, ChatBlockType, DivRefType, Setter} from '../../../common'

export const useFromQToChatBlocks = (
  chatQ: ChatBlocksType,
  isDBLoad: boolean,
  divChatsBodyRef: DivRefType,
  setGoToBot: Setter<boolean>,
  setChatBlocks: Setter<ChatBlocksType>,
  setChatQ: Setter<ChatBlocksType>
) => {
  useEffect(() => {
    if (chatQ && chatQ.length > 0 && isDBLoad) {
      const newChatQ = [...chatQ]
      setChatBlocks(prev => [...prev, newChatQ.pop() as ChatBlockType])
      setChatQ(newChatQ)
      if (divChatsBodyRef?.current) {
        const {scrollTop, clientHeight, scrollHeight} = divChatsBodyRef.current
        if (scrollTop + clientHeight >= scrollHeight) {
          setGoToBot(true)
        }
      }
    }
  }, [chatQ, isDBLoad, divChatsBodyRef, setGoToBot, setChatBlocks, setChatQ])
}

import {useEffect} from 'react'
import {ChatBlocksType, ChatBlockType, Setter} from '../../../common'

export const useFromQToChatBlocks = (
  chatQ: ChatBlocksType,
  isDBLoad: boolean,
  setChatBlocks: Setter<ChatBlocksType>,
  setChatQ: Setter<ChatBlocksType>
) => {
  useEffect(() => {
    if (chatQ && chatQ.length > 0 && isDBLoad) {
      const newChatQ = [...chatQ]
      setChatBlocks(prev => [...prev, newChatQ.pop() as ChatBlockType])
      setChatQ(newChatQ)
    }
  }, [chatQ, isDBLoad, setChatBlocks, setChatQ])
}

import { useEffect } from 'react'
import {ChatBlocksType, DivRefType, Setter} from '../../../common'

export const useSetScrollBottom = (
  chatBlocks: ChatBlocksType,
  divChatsBodyRef: DivRefType,
  goToBot: boolean,
  setGoToBot: Setter<boolean>
) => {
  useEffect(() => {
    if (chatBlocks && goToBot && divChatsBodyRef?.current) {
      setGoToBot(false)
    }
  }, [chatBlocks, divChatsBodyRef, goToBot, setGoToBot])
}

import {useEffect} from 'react'
import {ChatBlocksType, DivRefType, Setter} from '../../../common'

export const useSetScrollBottom = (
  chatBlocks: ChatBlocksType,
  divChatsBodyRef: DivRefType,
  goToBot: boolean,
  setGoToBot: Setter<boolean>
) => {
  useEffect(() => {
    if (goToBot && divChatsBodyRef?.current) {
      const {scrollTop, clientHeight, scrollHeight} = divChatsBodyRef.current

      console.log(`${scrollTop} + ${clientHeight} ?? ${scrollHeight}`)
      if (scrollTop + clientHeight < scrollHeight) {
        setGoToBot(false)
        divChatsBodyRef.current.scrollTop = scrollHeight
      }
    }
  }, [chatBlocks, divChatsBodyRef, goToBot, setGoToBot])
}

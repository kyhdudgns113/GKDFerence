import {useEffect} from 'react'
import {ChatBlocksType, Setter} from '../../../common'
import {get} from '../../../server'

import * as U from '../../../utils'

export const useGetChatBlocksFromDB = (
  cOId: string,
  isDBLoad: boolean,
  setChatBlocks: Setter<ChatBlocksType>,
  setIsDBLoad: Setter<boolean>
) => {
  useEffect(() => {
    U.readStringP('jwt').then(jwt => {
      if (jwt && cOId && !isDBLoad) {
        get(`/sidebar/chatRoom/getChatBlocks/${cOId}/0`, jwt)
          .then(res => res.json())
          .then(res => {
            const {ok, body, errors} = res
            if (ok) {
              const chatBlocks = body.chatBlocks
              setChatBlocks(chatBlocks)
              setIsDBLoad(true)
            } else {
              const keys = Object.keys(errors)
              alert(errors[keys[0]])
            }
          })
      }
    })
  }, [isDBLoad, cOId, setChatBlocks, setIsDBLoad])
}

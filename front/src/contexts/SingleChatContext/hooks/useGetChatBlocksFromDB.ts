import {useEffect} from 'react'
import {ChatBlocksType, Setter} from '../../../common'
import {useAuth} from '../../AuthContext/AuthContext'
import {get} from '../../../server'

export const useGetChatBlocksFromDB = (
  cOId: string,
  isDBLoad: boolean,
  setChatBlocks: Setter<ChatBlocksType>,
  setIsDBLoad: Setter<boolean>
) => {
  const {jwt} = useAuth()
  useEffect(() => {
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
  }, [jwt, isDBLoad, cOId, setChatBlocks, setIsDBLoad])
}

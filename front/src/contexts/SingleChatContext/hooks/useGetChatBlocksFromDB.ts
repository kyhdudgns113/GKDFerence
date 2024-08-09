import {useEffect} from 'react'
import {ChatBlocksType, Setter} from '../../../common'
import {get} from '../../../server'
import {useAuth} from '../../AuthContext/AuthContext'

export const useGetChatBlocksFromDB = (
  cOId: string,
  isDBLoad: boolean,
  setChatBlocks: Setter<ChatBlocksType>,
  setIsDBLoad: Setter<boolean>
) => {
  const {getJwt} = useAuth()
  useEffect(() => {
    getJwt().then(jwtFromClient => {
      if (jwtFromClient && cOId && !isDBLoad) {
        get(`/sidebar/chatRoom/getChatBlocks/${cOId}/0`, jwtFromClient)
          .then(res => res.json())
          .then(res => {
            const {ok, body, errors} = res
            if (ok) {
              const chatBlocks = body.chatBlocks
              setChatBlocks(chatBlocks)
              setIsDBLoad(true)
            } // BLANK LINE COMMENT:
            else {
              const keys = Object.keys(errors)
              alert(errors[keys[0]])
            }
          })
      }
    })
  }, [isDBLoad, cOId, getJwt, setChatBlocks, setIsDBLoad])
}

import {useEffect} from 'react'
import {useAuth} from '../../AuthContext'
import {useLayoutContext} from '../../LayoutContext'
import {get} from '../../../server'

export const useGetChatDataFromDB = () => {
  const {jwt} = useAuth()
  const {pageOId} = useLayoutContext()

  useEffect(() => {
    if (jwt && pageOId) {
      get(`/sidebar/chatList/getChatRoomData/${pageOId}`, jwt)
        .then(res => res && res.json())
        .then(res => {
          // const {ok, body, errors} = res //  eslint-disable-line
        })
    }
  }, [jwt, pageOId])
}

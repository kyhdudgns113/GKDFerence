import {useEffect} from 'react'
import {Setter, SocketType} from '../../../common'

/**
 * 소켓 자동 종료 부분
 * 절대 여기에 다른 의존성 변수 추가하지 말것
 */
export const useExitSocketChat = (sockChat: SocketType, setSockChat: Setter<SocketType>) => {
  useEffect(() => {
    return () => {
      if (sockChat) {
        sockChat.disconnect()
        setSockChat(null)
      }
    }
  }, [sockChat, setSockChat])
}

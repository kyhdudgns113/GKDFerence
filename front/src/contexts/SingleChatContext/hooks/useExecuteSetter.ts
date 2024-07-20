import {useEffect} from 'react'
import {useLayoutContext} from '../../LayoutContext/LayoutContext'
import {ChatBlocksType, Setter, SocketType} from '../../../common'
import {useLocation} from 'react-router-dom'

/**
 * SingleChatContext 에서 쓰는 모든 것들을 초기화 해야 한다.
 * 그래야 채팅창 이동했을때 제대로 변경된다.
 */
export const useExecuteSetter = (
  setCOId: Setter<string>,
  setTUId: Setter<string>,
  setTUOId: Setter<string>,
  setIsDBLoad: Setter<boolean>,
  setSockChat: Setter<SocketType>,
  setChatInput: Setter<string>,
  setChatQ: Setter<ChatBlocksType>
) => {
  const {setPageOId} = useLayoutContext()
  const location = useLocation()

  useEffect(() => {
    if (location) {
      setPageOId(location.state.cOId)
      setCOId(location.state.cOId)
      setTUId(location.state.tUId)
      setTUOId(location.state.tUOId)
      setIsDBLoad(false)
      setSockChat(null)
      setChatInput('')
      setChatQ([])
    }
  }, [
    location,
    setPageOId,
    setCOId,
    setTUId,
    setTUOId,
    setIsDBLoad,
    setSockChat,
    setChatInput,
    setChatQ
  ])
}

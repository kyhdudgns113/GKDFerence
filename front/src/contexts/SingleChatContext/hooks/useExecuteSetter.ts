import {useEffect} from 'react'
import {useLayoutContext} from '../../LayoutContext'
import {Setter} from '../../../common'

export const useExecuteSetter = (
  chatRoomOId: string,
  targetId: string,
  targetOId: string,
  setCOId: Setter<string>,
  setTUId: Setter<string>,
  setTUOId: Setter<string>
) => {
  const {setPageOId} = useLayoutContext()
  useEffect(() => {
    setPageOId(chatRoomOId)
    setCOId(chatRoomOId)
    setTUId(targetId)
    setTUOId(targetOId)
  }, [chatRoomOId, targetId, targetOId, setPageOId, setCOId, setTUId, setTUOId])
}

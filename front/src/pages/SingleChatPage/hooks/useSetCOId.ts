import {useEffect} from 'react'
import {useLayoutContext} from '../../../contexts'
import {useLocation} from 'react-router-dom'

// NOTE: 페이지 새로고침되서 pageOId 지워진다.
// NOTE: localStorage 에 넣던가 URL 파싱해서 쓰자.
// NOTE: 아 로컬 스토리지는 넣으면 안되겠다. 탭 여러개일수도 있다.
export const useSetCOId = () => {
  const {setPageOId} = useLayoutContext()
  const location = useLocation()

  useEffect(() => {
    const getPageOId = location.state?.cOId || ''
    setPageOId(getPageOId)

    return () => {
      setPageOId('')
    }
  }, [setPageOId, location])
}

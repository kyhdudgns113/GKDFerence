import {useEffect} from 'react'
import {useLayoutContext} from '../../LayoutContext'
import {Setter} from '../../../common'
import {useLocation} from 'react-router-dom'

export const useExecuteSetter = (
  setCOId: Setter<string>,
  setTUId: Setter<string>,
  setTUOId: Setter<string>
) => {
  const {setPageOId} = useLayoutContext()
  const location = useLocation()

  useEffect(() => {
    if (location) {
      setPageOId(location.state.cOId)
      setCOId(location.state.cOId)
      setTUId(location.state.tUId)
      setTUOId(location.state.tUOId)
    }
  }, [location, setPageOId, setCOId, setTUId, setTUOId])
}

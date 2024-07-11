import {useCallback, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../../../contexts'

/**
 *  If jwt token available, go to main
 */
export const useGoToMain = () => {
  const navigate = useNavigate()
  const {checkToken} = useAuth()
  const successCallback = useCallback(() => {
    navigate('/main')
  }, [navigate])
  const failCallback = useCallback(() => {
    navigate('/')
  }, [navigate])

  useEffect(() => {
    checkToken(successCallback, failCallback)
  }, [checkToken, successCallback, failCallback])
}

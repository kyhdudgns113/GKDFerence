import {useEffect} from 'react'
import {useAuth} from '../../../contexts/AuthContext'
import {useNavigate} from 'react-router-dom'

/**
 *  Go to main if already logged
 */
export const useGoToMain = () => {
  const {checkToken} = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    checkToken(
      () => navigate('/main'),
      () => {}
    )
  }, [checkToken, navigate])
}

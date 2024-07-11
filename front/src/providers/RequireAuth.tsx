import type {FC, PropsWithChildren} from 'react'
import {useAuth} from '../contexts'
import {useNavigate} from 'react-router-dom'

type RequireAuthProps = {}

const RequireAuth: FC<PropsWithChildren<RequireAuthProps>> = ({children}) => {
  const {checkToken} = useAuth()

  const navigate = useNavigate()

  checkToken(
    () => {},
    () => navigate('/')
  )

  return <>{children}</> // jwt 토큰이 있으므로 children이 element 가 되도록 함
}
export default RequireAuth

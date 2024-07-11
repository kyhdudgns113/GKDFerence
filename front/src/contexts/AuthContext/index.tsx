import type {FC, PropsWithChildren} from 'react'
import {createContext, useContext, useState, useCallback, useEffect} from 'react'
import * as U from '../../utils'
import {post, get} from '../../server'
import {useNavigate} from 'react-router-dom'
import {writeBodyObject} from './writeBodyObject'
import {AuthObjectType, Callback, ErrorsType} from '../../common'

type ContextType = {
  alertMsg?: string
  id?: string
  email?: string
  jwt?: string

  signup: (id: string, email: string, password: string) => Promise<ErrorsType>
  login: (id: string, password: string) => Promise<ErrorsType>
  logout: (callback?: Callback) => void
  checkToken: (successCallBack?: Callback, failCallBack?: Callback) => void
  refreshToken: (callback?: Callback) => void
}

export const AuthContext = createContext<ContextType>({
  signup: async (id: string, email: string, password: string) => ({}),
  login: async (id: string, password: string) => ({}),
  logout: (callback?: Callback) => {},
  checkToken: (successCallBack?: Callback, failCallBack?: Callback) => {},
  refreshToken: (callback?: Callback) => {}
})

type AuthProviderProps = {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({children}) => {
  const [alertMsg, setAlertMsg] = useState<string>('')
  const [id, setId] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [jwt, setJwt] = useState<string>('')

  const navigate = useNavigate()

  const signup = useCallback((id: string, email: string, password: string) => {
    const user = {id, email, password}
    const ret = new Promise<ErrorsType>((resolve, reject) => {
      post('/auth/signup', user)
        .then(res => res.json())
        .then((result: AuthObjectType) => {
          const {ok, body, errors} = result

          if (ok) {
            writeBodyObject(body, setId, setEmail, setJwt)
            resolve({})
          } else {
            reject(errors)
          }
        })
        .catch((e: Error) => setAlertMsg(e.message))
    })
    return ret
  }, [])
  const login = useCallback((id: string, password: string, callback?: Callback) => {
    const user = {id, password}
    const ret = new Promise<ErrorsType>((resolve, reject) => {
      post('/auth/login', user)
        .then(res => res.json())
        .then((result: AuthObjectType) => {
          const {ok, body, errors} = result
          if (ok) {
            writeBodyObject(body, setId, setEmail, setJwt, callback)
            resolve({})
          } else {
            reject(errors)
          }
        })
        .catch((e: Error) => setAlertMsg(e.message))
    })
    return ret
  }, [])
  const logout = useCallback((callback?: Callback) => {
    writeBodyObject({}, setId, setEmail, setJwt, callback)
  }, [])
  const checkToken = useCallback(
    (successCallBack?: Callback, failCallBack?: Callback) => {
      let JWT = jwt
      if (!JWT) {
        U.readStringP('jwt').then(retJwt => {
          JWT = retJwt || ''
        })
      }
      if (JWT) {
        get('/auth/checkToken', JWT)
          .then(res => res.json())
          .then((result: AuthObjectType) => {
            const {ok} = result
            if (ok) {
              successCallBack && successCallBack()
            } else {
              writeBodyObject({}, setId, setEmail, setJwt, () => {
                failCallBack ? failCallBack() : navigate('/')
              })
            }
          })
          .catch((e: Error) => {
            console.log(e.message)
          })
      } else {
        failCallBack && failCallBack()
      }
    },
    [jwt, navigate]
  )
  const refreshToken = useCallback(
    (callback?: Callback) => {
      let JWT = jwt
      if (!JWT) {
        U.readStringP('jwt').then(retJwt => {
          JWT = retJwt || ''
        })
      }
      if (JWT) {
        get('/auth/refreshToken', jwt)
          .then(res => res.json())
          .then((result: AuthObjectType) => {
            const {ok, body} = result
            if (ok) {
              U.writeStringP('jwt', body?.jwt ?? '').then(() => setJwt(body?.jwt || ''))
              callback && callback()
            } else {
              writeBodyObject({}, setId, setEmail, setJwt, () => navigate('/'))
            }
          })
          .catch((e: Error) => {
            console.log(e.message)
          })
      } else {
        navigate('/')
      }
    },
    [jwt, navigate]
  )

  useEffect(() => {
    if (alertMsg) {
      alert(alertMsg)
      setAlertMsg('')
    }
  }, [alertMsg])

  const value = {
    alertMsg,
    id,
    email,
    jwt,

    signup,
    login,
    logout,

    checkToken,
    refreshToken
  }
  return <AuthContext.Provider value={value} children={children} />
}

export const useAuth = () => {
  return useContext(AuthContext)
}

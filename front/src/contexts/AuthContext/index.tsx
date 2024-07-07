import type {FC, PropsWithChildren} from 'react'
import {createContext, useContext, useState, useCallback, useEffect} from 'react'
import * as U from '../../utils'
import {post} from '../../server'
import {useNavigate} from 'react-router-dom'
import {get} from '../../server'
import {AuthBodyType, Callback, ErrorsType} from './types'
import {writeBodyObject} from './writeBodyObject'

type ContextType = {
  alertMsg?: string

  signup: (id: string, email: string, password: string) => Promise<ErrorsType>
  login: (id: string, password: string, callback?: Callback) => void
  logout: (callback?: Callback) => void
  checkToken: (callback?: Callback) => void
  refreshToken: (callback?: Callback) => void
}

export const AuthContext = createContext<ContextType>({
  signup: async (id: string, email: string, password: string) => ({}),
  login: (id: string, password: string, callback?: Callback) => {},
  logout: (callback?: Callback) => {},
  checkToken: (callback?: Callback) => {},
  refreshToken: (callback?: Callback) => {}
})

type AuthProviderProps = {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({children}) => {
  const [alertMsg, setAlertMsg] = useState<string>('')

  const navigate = useNavigate()

  const signup = useCallback((id: string, email: string, password: string) => {
    const user = {id, email, password}
    const ret = new Promise<ErrorsType>((resolve, reject) => {
      post('/auth/signup', user)
        .then(res => res.json())
        .then((result: {ok: boolean; body?: AuthBodyType; errors: ErrorsType}) => {
          const {ok, body, errors} = result
          if (ok) {
            writeBodyObject(body)
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
    post('/auth/login', user)
      .then(res => res.json())
      .then((result: {ok: boolean; body?: AuthBodyType; errors?: string}) => {
        const {ok, body, errors} = result
        if (ok) {
          writeBodyObject(body, callback)
        } else {
          setAlertMsg(errors ?? '')
        }
      })
      .catch((e: Error) => setAlertMsg(e.message))
  }, [])
  const logout = useCallback((callback?: Callback) => {
    writeBodyObject({}, callback)
  }, [])
  const checkToken = useCallback(
    (callback?: Callback) => {
      U.readStringP('jwt').then(jwt => {
        if (!jwt) {
          navigate('/') // jwt 토큰이 없으므로 로그인 화면으로 이동
        } else {
          get('/auth/checkToken', jwt)
            .then(res => res.json())
            .then((result: {ok: boolean; body?: {jwt: string; id: string}; errors?: string}) => {
              const {ok} = result
              if (ok) {
                callback && callback()
              } else {
                writeBodyObject({}, () => navigate('/'))
              }
            })
            .catch((e: Error) => {
              console.log(e.message)
            })
        }
      })
    },
    [navigate]
  )
  const refreshToken = useCallback(
    (callback?: Callback) => {
      U.readStringP('jwt').then(jwt => {
        if (!jwt) {
          navigate('/') // jwt 토큰이 없으므로 로그인 화면으로 이동
        } else {
          get('/auth/refreshToken', jwt)
            .then(res => res.json())
            .then((result: {ok: boolean; body?: {jwt: string; id: string}; errors?: string}) => {
              const {ok, body} = result
              if (ok) {
                // Do not use writeBodyObject()
                // It must not change "id, email, etc..."
                U.writeStringP('jwt', body?.jwt ?? '')
                callback && callback()
              } else {
                writeBodyObject({}, () => navigate('/'))
              }
            })
            .catch((e: Error) => {
              console.log(e.message)
            })
        }
      })
    },
    [navigate]
  )

  useEffect(() => {
    if (alertMsg) {
      alert(alertMsg)
      setAlertMsg('')
    }
  }, [alertMsg])

  const value = {
    alertMsg,

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

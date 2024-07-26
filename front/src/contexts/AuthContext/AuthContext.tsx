import type {FC, PropsWithChildren} from 'react'
import {createContext, useContext, useState, useCallback, useEffect} from 'react'
import * as U from '../../utils'
import {post, get} from '../../server'
import {useNavigate} from 'react-router-dom'
import {AuthObjectType, Callback, ErrorsType} from '../../common'

type ContextType = {
  alertMsg?: string
  id?: string
  uOId?: string
  email?: string

  signup: (id: string, email: string, password: string) => Promise<ErrorsType>
  login: (id: string, password: string) => Promise<ErrorsType>
  logout: (callback?: Callback) => void
  checkToken: (successCallBack?: Callback, failCallBack?: Callback) => void
  refreshToken: (callback?: Callback) => void

  getJwt: () => Promise<string>
}

export const AuthContext = createContext<ContextType>({
  signup: async (id: string, email: string, password: string) => ({}),
  login: async (id: string, password: string) => ({}),
  logout: (callback?: Callback) => {},
  checkToken: (successCallBack?: Callback, failCallBack?: Callback) => {},
  refreshToken: (callback?: Callback) => {},
  getJwt: async () => ''
})

type AuthProviderProps = {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({children}) => {
  const [alertMsg, setAlertMsg] = useState<string>('')
  const [id, setId] = useState<string>('')
  const [uOId, setUOId] = useState<string>('')
  const [email, setEmail] = useState<string>('')

  const navigate = useNavigate()

  const getJwt = useCallback(async () => {
    return await U.readStringP('jwt')
      .then(ret => {
        const {header, jwtBody} = U.decodeJwtFromServer(ret || '')
        return U.encodeJwtFromClient(header, jwtBody)
      })
      .catch(() => {
        return ''
      })
  }, [])

  const signup = useCallback((id: string, email: string, password: string) => {
    const user = {id, email, password}
    const ret = new Promise<ErrorsType>((resolve, reject) => {
      post('/auth/signup', user)
        .then(res => res.json())
        .then((result: AuthObjectType) => {
          const {ok, body, errors} = result
          if (ok) {
            U.writeBodyObject(body, setId, setUOId, setEmail)
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
            U.writeBodyObject(body, setId, setUOId, setEmail, callback)
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
    U.writeBodyObject({}, setId, setUOId, setEmail, callback)
  }, [])
  const checkToken = useCallback(
    async (successCallBack?: Callback, failCallBack?: Callback) => {
      U.readStringP('jwt').then(jwt => {
        if (jwt) {
          const {header, jwtBody} = U.decodeJwtFromServer(jwt)
          const jwtFromClient = U.encodeJwtFromClient(header, jwtBody)
          get('/auth/checkToken', jwtFromClient)
            .then(res => res.json())
            .then((result: AuthObjectType) => {
              const {ok} = result
              if (ok) {
                successCallBack && successCallBack()
              } else {
                U.writeBodyObject({}, setId, setUOId, setEmail, () => {
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
      })
    },
    [navigate]
  )
  const refreshToken = useCallback(
    async (callback?: Callback) => {
      U.readStringP('jwt').then(jwt => {
        if (jwt) {
          const {header, jwtBody} = U.decodeJwtFromServer(jwt)
          const jwtFromClient = U.encodeJwtFromClient(header, jwtBody)
          get('/auth/refreshTokenPhase1', jwtFromClient)
            .then(res => res.json())
            .then((result: AuthObjectType) => {
              const {ok, body, errors} = result
              const jwtFromServer = body.jwt
              const {header, jwtBody} = U.decodeJwtFromServer(jwtFromServer)
              if (ok && header && jwtBody) {
                U.writeStringP('jwt', jwtFromServer || '').then(jwtBody => {
                  const jwtFromClient = U.encodeJwtFromClient(header, jwtBody)
                  get('/auth/refreshTokenPhase2', jwtFromClient)
                    .then(res => res.json())
                    .then(res => {
                      const {ok, body, errors} = result
                      if (ok) {
                        const jwtFromServer = body.jwt
                        U.writeStringP('jwt', jwtFromServer || '') //
                          .then(res => {
                            callback && callback()
                          })
                      } else {
                        const errKey = Object.keys(errors)[0]
                        setAlertMsg(errors[errKey])
                      }
                    })
                })
              } else {
                const keys = Object.keys(errors)
                setAlertMsg(errors[keys[0]])

                U.writeBodyObject({}, setId, setUOId, setEmail, () => navigate('/'))
              }
            })
            .catch((e: Error) => {
              console.log(e.message)
            })
        } else {
          navigate('/')
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

  /**
   * 새로고침등의 이슈로 useState 에 저장되어있던 id, uOId, email 이 날아가는 경우가 있다.
   * jwt 는 읽어오지 않는다. 어차피 setJwt 같은거 해봐야 쓸데도 없다.
   * 한 쪽 tab 에서 refreshToken 호출되었을 때, 다른 탭에서도 호출이 되지는 않기 때문이다.
   * 그러면 갱신되지 않은 탭에서 뭔가를 하려고 할 때, 로컬 스토리지에는 싱싱한 jwt 가 있음에도 불구하고
   * 이미 만료가 된 jwt 로 인증을 하려다가 로그아웃 당할 수 있다.
   */
  useEffect(() => {
    U.readStringP('id').then(idVal => {
      U.readStringP('uOId').then(uOIdVal => {
        U.readStringP('email').then(emailVal => {
          setId(idVal || '')
          setUOId(uOIdVal || '')
          setEmail(emailVal || '')
        })
      })
    })
  }, [])

  const value = {
    alertMsg,
    id,
    uOId,
    email,

    signup,
    login,
    logout,

    checkToken,
    refreshToken,

    getJwt
  }
  return <AuthContext.Provider value={value} children={children} />
}

export const useAuth = () => {
  return useContext(AuthContext)
}

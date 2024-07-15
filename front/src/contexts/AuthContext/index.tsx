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
  _id?: string
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
  const [_id, set_id] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [jwt, setJwt] = useState<string>('')

  const navigate = useNavigate()

  const getJwt = useCallback(async () => {
    return await U.readStringP('jwt')
      .then(ret => {
        return ret || ''
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
            writeBodyObject(body, setId, set_id, setEmail, setJwt)
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
            writeBodyObject(body, setId, set_id, setEmail, setJwt, callback)
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
    writeBodyObject({}, setId, set_id, setEmail, setJwt, callback)
  }, [])
  const checkToken = useCallback(
    async (successCallBack?: Callback, failCallBack?: Callback) => {
      const jwt = await getJwt()
      if (jwt) {
        get('/auth/checkToken', jwt)
          .then(res => res.json())
          .then((result: AuthObjectType) => {
            const {ok} = result
            if (ok) {
              successCallBack && successCallBack()
            } else {
              writeBodyObject({}, setId, set_id, setEmail, setJwt, () => {
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
    [getJwt, navigate]
  )
  const refreshToken = useCallback(
    async (callback?: Callback) => {
      const jwt = await getJwt()
      if (jwt) {
        get('/auth/refreshToken', jwt)
          .then(res => res.json())
          .then((result: AuthObjectType) => {
            const {ok, body, errors} = result
            if (ok) {
              U.writeStringP('jwt', body?.jwt ?? '')
              setJwt(body?.jwt || '')
              callback && callback()
            } else {
              const keys = Object.keys(errors)
              setAlertMsg(errors[keys[0]])

              writeBodyObject({}, setId, set_id, setEmail, setJwt, () => navigate('/'))
            }
          })
          .catch((e: Error) => {
            console.log(e.message)
          })
      } else {
        navigate('/')
      }
    },
    [getJwt, navigate]
  )

  useEffect(() => {
    if (alertMsg) {
      alert(alertMsg)
      setAlertMsg('')
    }
  }, [alertMsg])

  /**
   * 새로고침등의 이슈로 useState 에 저장되어있던 id, _id, email 이 날아가는 경우가 있다.
   */
  useEffect(() => {
    U.readStringP('jwt').then(jwtVal => {
      U.readStringP('id').then(idVal => {
        U.readStringP('_id').then(_idVal => {
          U.readStringP('email').then(emailVal => {
            setId(idVal || '')
            set_id(_idVal || '')
            setEmail(emailVal || '')
            setJwt(jwtVal || '')
          })
        })
      })
    })
  }, [])

  const value = {
    alertMsg,
    id,
    _id,
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

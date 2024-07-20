import type {FC, PropsWithChildren} from 'react'
import {createContext, useCallback, useContext, useEffect, useState} from 'react'
import {io, Socket} from 'socket.io-client'

import {DefaultEventsMap} from 'socket.io/dist/typed-events'
import {serverUrl} from '../../client_secret'

import * as U from '../../utils'
import {SocketUserConnectedType} from '../../common'
import {useAuth} from '../AuthContext/AuthContext'

type SocketType = Socket<DefaultEventsMap, DefaultEventsMap> | undefined | null

type ContextType = {
  socketP?: SocketType
  socketPId?: string
  socketPInit: () => void
  socketPReset: () => void
  addSocketPOn: (event: string, callback: (payload: any) => void) => void
  socketEmit: (socket: SocketType, event: string, payload: any) => void
}

export const SocketContext = createContext<ContextType>({
  socketPInit: () => {},
  socketPReset: () => {},
  addSocketPOn: () => {},
  socketEmit: () => {}
})

type SocketProviderProps = {}

export const SocketProvider: FC<PropsWithChildren<SocketProviderProps>> = ({children}) => {
  /**
   * // NOTE: socketP: It will be reset automatically in LocalContext
   */
  const [socketP, setSocketP] = useState<SocketType>(null)
  const [socketPId, setSocketPIds] = useState<string>('')

  const {checkToken, refreshToken} = useAuth()

  // NOTE: socketP 는 SocketProvider 가 아니라 Layout 과 수명을 같이 해야한다.
  // NOTE: 따라서 socketP 를 초기화하는 함수를 만들어서 Layout 쪽에서 호출하도록 한다.
  const socketPInit = useCallback(() => {
    if (!socketP) {
      const newSocket = io(serverUrl)

      setSocketP(newSocket)

      newSocket.on('user connected', (recvObj: SocketUserConnectedType) => {
        console.log('USER CONNECTED : ', recvObj.socketPId)
        setSocketPIds(recvObj.socketPId || '')
      })

      // newSocket.on('user disconnect', (recvObj: any) => {
      //   logout()
      // })

      U.readStringP('uOId').then(uOId => {
        const sendObj: SocketUserConnectedType = {
          uOId: uOId || ''
        }
        newSocket.emit('user connected', sendObj)
      })
      return newSocket
    }
  }, [socketP])

  const socketPReset = useCallback(() => {
    if (socketP) {
      socketP.disconnect()
      setSocketP(null)
    }
  }, [socketP])

  //  SocketProvider 내의 Context 에서 선언된 값들을 사용할 때 필요함.
  //  그 값들을 여기서 쓸 수는 없으니
  const addSocketPOn = useCallback(
    (event: string, callback: (payload: any) => void) => {
      if (socketP) {
        socketP.on(event, (payload: any) => {
          callback(payload)
        })
      }
    },
    [socketP]
  )

  const socketEmit = useCallback(
    (socket: SocketType, event: string, payload: any, jwtRefresh: boolean = false) => {
      jwtRefresh ? refreshToken() : checkToken()
      socket?.emit(event, payload)
    },
    [checkToken, refreshToken]
  )

  useEffect(() => {
    return () => {
      if (socketP && socketP.connected) {
        socketP.disconnect()
      }
    }
  }, [socketP])

  const value = {
    /** socket: Before use it, you should call useSocket() */
    socketP,
    socketPId,
    socketPInit,
    socketPReset,
    addSocketPOn,
    socketEmit
  }
  return <SocketContext.Provider value={value} children={children} />
}

export const useSocketContext = () => {
  return useContext(SocketContext)
}

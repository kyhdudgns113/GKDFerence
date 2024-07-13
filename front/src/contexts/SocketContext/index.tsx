import type {FC, PropsWithChildren} from 'react'
import {createContext, useCallback, useContext, useEffect, useState} from 'react'
import {io, Socket} from 'socket.io-client'

import {DefaultEventsMap} from 'socket.io/dist/typed-events'
import {serverUrl} from '../../client_secret'

import * as U from '../../utils'
import {SocketUserConnectedType} from '../../common'
import {useAuth} from '../AuthContext'

type SocketType = Socket<DefaultEventsMap, DefaultEventsMap> | undefined | null

type ContextType = {
  socketP?: SocketType
  socketPInit: () => void
  socketPReset: () => void
  addSocketOn: (socket: SocketType, event: string, callback: (payload: any) => void) => void
  socketEmit: (socket: SocketType, event: string, payload: any) => void
}

export const SocketContext = createContext<ContextType>({
  socketPInit: () => {},
  socketPReset: () => {},
  addSocketOn: () => {},
  socketEmit: () => {}
})

type SocketProviderProps = {}

export const SocketProvider: FC<PropsWithChildren<SocketProviderProps>> = ({children}) => {
  /**
   * // NOTE: socketP: It will be reset automatically in LocalContext
   */
  const [socketP, setSocketP] = useState<SocketType>(null)

  const {checkToken, refreshToken} = useAuth()

  const socketPInit = () => {
    if (!socketP) {
      console.log('UseSocket: Create')
      const newSocket = io(serverUrl)

      setSocketP(newSocket)

      newSocket.on('user connected', (recvObj: SocketUserConnectedType) => {
        console.log('USER CONNECTED : ', recvObj._id)
      })

      U.readStringP('_id').then(_id => {
        const sendObj: SocketUserConnectedType = {
          _id: _id || ''
        }
        newSocket.emit('user connected', sendObj)
      })
      return newSocket
    }
  }

  const socketPReset = () => {
    if (socketP) {
      setSocketP(null)
    }
  }

  const addSocketOn = useCallback(
    (socket: SocketType, event: string, callback: (payload: any) => void) => {
      socket?.on(event, (payload: any) => {
        callback(payload)
      })
    },
    []
  )

  const socketEmit = useCallback(
    async (socket: SocketType, event: string, payload: any, jwtRefresh: boolean = false) => {
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
    socketPInit,
    socketPReset,
    addSocketOn,
    socketEmit
  }
  return <SocketContext.Provider value={value} children={children} />
}

export const useSocketContext = () => {
  return useContext(SocketContext)
}

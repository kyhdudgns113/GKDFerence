import type {FC, PropsWithChildren} from 'react'
import {createContext, useCallback, useContext, useEffect, useState} from 'react'
import {io, Socket} from 'socket.io-client'

import {DefaultEventsMap} from 'socket.io/dist/typed-events'
import {serverUrl} from '../../client_secret'

import * as U from '../../utils'
import {SocketUserConnectedType} from '../../common'

type ContextType = {
  socketP?: Socket<DefaultEventsMap, DefaultEventsMap> | null
  socketPInit: () => void
  socketPReset: () => void
  addSocketPOn<PayloadType>(event: string, callback: (payload: PayloadType) => void): void
}

export const SocketContext = createContext<ContextType>({
  socketPInit: () => {},
  socketPReset: () => {},
  addSocketPOn: () => {}
})

type SocketProviderProps = {}

export const SocketProvider: FC<PropsWithChildren<SocketProviderProps>> = ({children}) => {
  /**
   * socketP: It will be reset automatically in LocalContext
   */
  const [socketP, setSocketP] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null)

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

  const addSocketPOn = useCallback(
    (event: string, callback: (payload: any) => void) => {
      socketP?.on(event, (payload: any) => {
        callback(payload)
      })
    },
    [socketP]
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
    addSocketPOn
  }
  return <SocketContext.Provider value={value} children={children} />
}

export const useSocketContext = () => {
  return useContext(SocketContext)
}

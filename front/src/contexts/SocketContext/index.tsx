import type {FC, PropsWithChildren} from 'react'
import {createContext, useContext, useEffect, useState} from 'react'
import {io, Socket} from 'socket.io-client'

import {DefaultEventsMap} from 'socket.io/dist/typed-events'
import {serverUrl} from '../../client_secret'

import * as U from '../../utils'
import {SocketUserConnectedType} from './types'

type ContextType = {
  socketP?: Socket<DefaultEventsMap, DefaultEventsMap> | null
  socketPInit: () => void
  socketPReset: () => void
}

export const SocketContext = createContext<ContextType>({
  socketPInit: () => {},
  socketPReset: () => {}
})

type SocketProviderProps = {}

export const SocketProvider: FC<PropsWithChildren<SocketProviderProps>> = ({children}) => {
  const [socketP, setSocketP] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null)

  const socketPInit = () => {
    if (!socketP) {
      console.log('UseSocket: Create')
      const newSocket = io(serverUrl)

      setSocketP(newSocket)

      newSocket.on('user connected', (recvObj: SocketUserConnectedType) => {
        console.log('USER CONNECTED : ', recvObj.id)
      })

      U.readStringP('id').then(id => {
        const sendObj: SocketUserConnectedType = {
          id: id || ''
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
    socketPReset
  }
  return <SocketContext.Provider value={value} children={children} />
}

export const useSocketContext = () => {
  return useContext(SocketContext)
}

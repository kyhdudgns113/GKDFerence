import type {ChangeEvent, FC, PropsWithChildren} from 'react'
import {createContext, useCallback, useContext, useEffect, useState} from 'react'
import DocumentGPage from '../../pages/DocumentGPage/DocumentGPage'
import {
  DocContentsType,
  DocTitleType,
  Setter,
  SocketDocConnectedType,
  SocketType
} from '../../common'
import {useLocation} from 'react-router-dom'
import {useAuth} from '../AuthContext/AuthContext'
import {useSocketContext} from '../SocketContext/SocketContext'
import {io} from 'socket.io-client'
import {serverUrl} from '../../client_secret'
import {useLayoutContext} from '../LayoutContext/LayoutContext'

type ContextType = {
  title?: DocTitleType
  setTitle: Setter<DocTitleType>

  contents?: DocContentsType
  setContents: Setter<DocContentsType>

  onChangeTitle: (e: ChangeEvent<HTMLInputElement>) => void
}

export const DocumentGContext = createContext<ContextType>({
  setTitle: () => {},
  setContents: () => {},

  onChangeTitle: () => {}
})

type DocumentGProviderProps = {}

export const DocumentGProvider: FC<PropsWithChildren<DocumentGProviderProps>> = ({children}) => {
  const [sockDoc, setSockDoc] = useState<SocketType>(null)
  const [title, setTitle] = useState<DocTitleType>('')
  const [contents, setContents] = useState<DocContentsType>([])

  const {uOId, getJwt} = useAuth()
  const {pageOId, setPageOId} = useLayoutContext()
  const {socketPId} = useSocketContext()

  const location = useLocation()

  const onChangeTitle = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value)
    },
    [setTitle]
  )

  // Setter area
  useEffect(() => {
    if (location) {
      setPageOId(location.state.dOId || '')
      setTitle(location.state.title || '')
    }
  }, [location, setPageOId])

  // Set sockDoc
  useEffect(() => {
    if (!sockDoc && socketPId && pageOId) {
      const newSocket = io(serverUrl)
      setSockDoc(newSocket)

      newSocket.on('documentG connected', (payload: SocketDocConnectedType) => {
        // 일단 뭐 안한다.
      })

      getJwt().then(jwtFromClient => {
        if (!uOId || !jwtFromClient) {
          alert('다음이 NULL 입니다. ' + !uOId && 'uOId ' + !jwtFromClient && 'jwt ')
        }
        const payload: SocketDocConnectedType = {
          jwt: jwtFromClient || '',
          uOId: uOId || '',
          dOId: pageOId || '',
          socketPId: socketPId || ''
        }
        newSocket.emit('documentG connected', payload)
      })
    }
  }, [sockDoc, socketPId, pageOId, uOId, getJwt])

  // Quit socket
  useEffect(() => {
    return () => {
      if (sockDoc) {
        sockDoc.disconnect()
        setSockDoc(null)
      }
    }
  }, [sockDoc, setSockDoc])

  // prettier-ignore
  const value = {
    title, setTitle,
    contents, setContents,

    onChangeTitle
  }
  return <DocumentGContext.Provider value={value} children={<DocumentGPage />} />
}

export const useDocumentGContext = () => {
  return useContext(DocumentGContext)
}

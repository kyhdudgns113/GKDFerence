import type {ChangeEvent, FC, FocusEvent, PropsWithChildren} from 'react'
import {createContext, useCallback, useContext, useEffect, useState} from 'react'
import DocumentGPage from '../../pages/DocumentGPage/DocumentGPage'
import {
  DocContentsType,
  DocTitleType,
  Setter,
  SocketDocChangeType,
  SocketDocConnectedType,
  SocketType
} from '../../common'
import {useLocation} from 'react-router-dom'
import {useAuth} from '../AuthContext/AuthContext'
import {useSocketContext} from '../SocketContext/SocketContext'
import {io} from 'socket.io-client'
import {serverUrl} from '../../client_secret'
import {useLayoutContext} from '../LayoutContext/LayoutContext'
import {get} from '../../server'

type ContextType = {
  dOId?: string
  setDOId: Setter<string>

  title?: DocTitleType
  setTitle: Setter<DocTitleType>

  contents?: DocContentsType
  setContents: Setter<DocContentsType>

  onBlurTitle: (e: FocusEvent<HTMLInputElement, Element>) => void
  onChangeTitle: (e: ChangeEvent<HTMLInputElement>) => void
}

export const DocumentGContext = createContext<ContextType>({
  setDOId: () => {},
  setTitle: () => {},
  setContents: () => {},

  onBlurTitle: () => {},
  onChangeTitle: () => {}
})

type DocumentGProviderProps = {}

export const DocumentGProvider: FC<PropsWithChildren<DocumentGProviderProps>> = ({children}) => {
  const [sockDoc, setSockDoc] = useState<SocketType>(null)
  const [dOId, setDOId] = useState<string>('')
  const [title, setTitle] = useState<DocTitleType>('')
  const [contents, setContents] = useState<DocContentsType>([])
  const [changeQ, setChangeQ] = useState<SocketDocChangeType[]>([])
  const [isDBLoad, setIsDBLoad] = useState<boolean>(false)
  const [isQWaiting, setIsQWaiting] = useState<boolean>(false)

  const {uOId, getJwt} = useAuth()
  const {pageOId, setPageOId} = useLayoutContext()
  const {socketPId} = useSocketContext()

  const location = useLocation()

  const onBlurTitle = useCallback(
    async (e: FocusEvent<HTMLInputElement, Element>) => {
      const newTitle: DocTitleType = e.currentTarget.value
      const jwt = await getJwt()
      const dOId = location.state.dOId
      const payload: SocketDocChangeType = {
        jwt: jwt,
        dOId: dOId,
        whichChanged: 'title',
        deleteInfo: {
          isDelete: true,
          startRow: 0,
          endRow: 0
        },
        insertInfo: {
          isAdd: true,
          insertRow: 0,
          contents: newTitle
        }
      }
      setChangeQ(prev => [...prev, payload])
    },
    [location, getJwt, setChangeQ]
  )

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
      setDOId(location.state.dOId || '')
      setTitle(location.state.title || '')
    }
  }, [location, setPageOId])

  // Get data from DB
  useEffect(() => {
    getJwt().then(jwtFromClient => {
      if (jwtFromClient && dOId && !isDBLoad) {
        get(`/sidebar/documentG/getDocumentG/${dOId}`, jwtFromClient)
          .then(res => res.json())
          .then(res => {
            const {ok, body, errors} = res
            if (ok) {
              setTitle(body.title)
              setContents(body.contents)
              setIsDBLoad(true)
            } else {
              const keys = Object.keys(errors)
              alert(errors[keys[0]])
            }
          })
      }
    })
  }, [dOId, isDBLoad, getJwt])

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

  // send Q to server with sockDoc
  useEffect(() => {
    if (sockDoc && changeQ && changeQ.length > 0) {
      // const newChangeQ = [...changeQ]
      // const payload = newChangeQ.pop()
      // sockDoc.emit('change document', payload)
      // setChangeQ(newChangeQ)
    }
  }, [changeQ, sockDoc])

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
    dOId, setDOId,
    title, setTitle,
    contents, setContents,

    onBlurTitle,
    onChangeTitle
  }
  return <DocumentGContext.Provider value={value} children={<DocumentGPage />} />
}

export const useDocumentGContext = () => {
  return useContext(DocumentGContext)
}

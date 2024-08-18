import type {ChangeEvent, FC, FocusEvent, PropsWithChildren} from 'react'
import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react'
import DocumentGPage from '../../pages/DocumentGPage/DocumentGPage'
import {
  ChatBlocksType,
  ChatBlockType,
  DivRefType,
  DocContentsType,
  DocTitleType,
  Setter,
  SocketDocChangeType,
  SocketDocChatContentType,
  SocketDocConnectedType,
  SocketDocRequestLockType,
  SocketType
} from '../../common'
import {useLocation} from 'react-router-dom'
import {useAuth} from '../AuthContext/AuthContext'
import {useSocketContext} from '../SocketContext/SocketContext'
import {io} from 'socket.io-client'
import {serverUrl} from '../../client_secret'
import {useLayoutContext} from '../LayoutContext/LayoutContext'
import {get} from '../../server'
import {onSetChangeQWhenReceiveInfo} from './hooks'

// prettier-ignore
type ContextType = {
  dOId?: string, setDOId: Setter<string>
  title?: DocTitleType, setTitle: Setter<DocTitleType>
  contents?: DocContentsType, setContents: Setter<DocContentsType>
  chatBlocks?: ChatBlocksType, setChatBlocks: Setter<ChatBlocksType>
  changedContents?: DocContentsType, setChangedContents: Setter<DocContentsType>
  isContentsChanged?: boolean, setIsContentsChanged: Setter<boolean>
  goToBot: boolean, setGoToBot: Setter<boolean>
  scrollYVal: number, setScrollYVal: Setter<number>
  scrollYMax: number, setScrollYMax: Setter<number>

  divChatsBodyRef: DivRefType

  addInfoToChangeQ: (
    whichChanged: 'title' | 'contents',
    startRow: number,
    endRow: number,
    contents: DocContentsType | undefined
  ) => void
  chat: (chatInputVal: string) => void
  onBlurTitle: (e: FocusEvent<HTMLInputElement, Element>) => void
  onChangeTitle: (e: ChangeEvent<HTMLInputElement>) => void
}

// prettier-ignore
export const DocumentGContext = createContext<ContextType>({
  goToBot: false, setGoToBot: () => {},
  scrollYVal: 0, setScrollYVal: () => {},
  scrollYMax: 0, setScrollYMax: () => {},

  divChatsBodyRef: null,

  setDOId: () => {},
  setTitle: () => {},
  setContents: () => {},
  setChatBlocks: () => {},
  setChangedContents: () => {},
  setIsContentsChanged: () => {},

  addInfoToChangeQ: () => {},
  chat: () => {},
  onBlurTitle: () => {},
  onChangeTitle: () => {}
})

type DocumentGProviderProps = {}

export const DocumentGProvider: FC<PropsWithChildren<DocumentGProviderProps>> = ({children}) => {
  const [sockDoc, setSockDoc] = useState<SocketType>(null)
  const [dOId, setDOId] = useState<string>('')
  const [title, setTitle] = useState<DocTitleType>('')
  const [contents, setContents] = useState<DocContentsType>([])
  const [chatBlocks, setChatBlocks] = useState<ChatBlocksType>([])
  const [chatQ, setChatQ] = useState<ChatBlocksType>([])
  const [changedContents, setChangedContents] = useState<DocContentsType>([])
  const [changeQ, setChangeQ] = useState<SocketDocChangeType[]>([])
  const [isDBLoad, setIsDBLoad] = useState<boolean>(false)
  const [isQWaitingLock, setIsQWaitingLock] = useState<boolean>(false)
  const [isContentsChanged, setIsContentsChanged] = useState<boolean>(false)
  const [goToBot, setGoToBot] = useState<boolean>(false)
  const [scrollYVal, setScrollYVal] = useState<number>(0)
  const [scrollYMax, setScrollYMax] = useState<number>(0)

  const divChatsBodyRef = useRef<HTMLDivElement | null>(null)

  const {id, uOId, getJwt, refreshToken} = useAuth()
  const {pageOId, setPageOId} = useLayoutContext()
  const {socketPId} = useSocketContext()

  const location = useLocation()

  // 수정사항 : 제목
  // changeQueue 에 넣는다.
  const addInfoToChangeQ = useCallback(
    (
      whichChanged: 'title' | 'contents',
      startRow: number,
      endRow: number,
      contents: DocContentsType | undefined
    ) => {
      if (uOId && dOId) {
        const changeQElement: SocketDocChangeType = {
          uOId: uOId,
          dOId: dOId,
          whichChanged: whichChanged,
          startRow: startRow,
          endRow: endRow,
          contents: contents
        }

        setChangeQ(prev => [...prev, changeQElement])
      }
    },
    [dOId, uOId]
  )
  const chat = useCallback(
    (chatInputVal: string) => {
      if (dOId && id && uOId && sockDoc && sockDoc.connected) {
        refreshToken()
        getJwt() // BLANK LINE COMMENT:
          .then(jwtFromClient => {
            const payload: SocketDocChatContentType = {
              jwt: jwtFromClient,
              dOId: dOId,
              body: {
                id: id,
                uOId: uOId,
                content: chatInputVal
              }
            }
            sockDoc.emit('documentG chatting', payload)
          })
        // end getJwt()
      }
    },
    [dOId, id, uOId, sockDoc, getJwt, refreshToken]
  )
  const onBlurTitle = useCallback(
    async (e: FocusEvent<HTMLInputElement, Element>) => {
      const newTitle: DocTitleType = e.currentTarget.value
      const dOId = location.state.dOId
      const payload: SocketDocChangeType = {
        uOId: uOId || '',
        dOId: dOId,
        whichChanged: 'title',
        startRow: 0,
        endRow: 0,
        title: newTitle
      }
      setChangeQ(prev => [...prev, payload])
    },
    [location, uOId, setChangeQ]
  )
  const onChangeTitle = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value)
    },
    [setTitle]
  )

  // AREA1: Set socket area
  const sockDocOn_documentGConnected = useCallback((newSocket: SocketType) => {
    newSocket!.on('documentG connected', (_payload: SocketDocConnectedType) => {
      // 일단 뭐 안한다.
    })
  }, [])
  // 서버로부터 본인의 순서가 되어 "수정 정보" 를 보내라는 신호가 오면
  // 서버로 "수정 정보"를 보낸다.
  const sockDocOn_documentGRequestLock = useCallback(
    (newSocket: SocketType, setChangeQ: Setter<SocketDocChangeType[]>) => {
      newSocket!.on('documentG request lock', (_payload: SocketDocRequestLockType) => {
        getJwt().then(jwtFromClient => {
          setChangeQ(prev => {
            let payload = prev.pop()
            if (payload) {
              payload.jwt = jwtFromClient
              payload.readyLock = _payload.readyLock || ''
              newSocket!.emit('documentG send change info', payload)
            }
            return prev
          })
        })
      })
    },
    [getJwt]
  )
  // 서버로부터 수정 정보가 들어오는 부분.
  const sockDocOn_documentGSendChangeInfo = useCallback(
    (newSocket: SocketType) => {
      newSocket!.on('documentG send change info', (_payload: SocketDocChangeType) => {
        // 1. 만약 이 수정정보가 내 대기순번이 지났다는거라면 업데이트 하지 않고 대기상태만 해제한다.
        if (_payload.uOId === uOId || (_payload.startRow === null && _payload.endRow === null)) {
          setIsQWaitingLock(false)
          return
        }
        // 2. changeQ 에 있는 내용들과 문서내용을 바꾼다.
        onSetChangeQWhenReceiveInfo(setChangeQ, _payload)

        // 3. changeQ 를 빠져나온 _payload(수정 정보) 를 처리한다.
        if (_payload.startRow !== null && _payload.endRow !== null) {
          if (_payload.startRow <= _payload.endRow) {
            if (_payload.whichChanged === 'contents') {
              setContents(prev => {
                const newPrev = [...prev]
                const deleteLen = _payload.endRow! - _payload.startRow! + 1
                const contents = _payload.contents ?? []
                newPrev.splice(_payload.startRow!, deleteLen, ...contents)
                return newPrev
              })
            } // BLANK LINE COMMENT:
            else {
              setTitle(_payload.contents ? _payload.contents[0] || '' : '')
            }
          }
        }
      })
    },
    [uOId]
  )
  // 채팅 받아오는 부분
  const sockDocOn_documentGChatting = useCallback((newSocket: SocketType) => {
    newSocket!.on('documentG chatting', (payload: SocketDocChatContentType) => {
      setChatQ(prev => [...prev, payload.body])
    })
  }, [])

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
    if (dOId && !isDBLoad) {
      getJwt().then(jwtFromClient => {
        if (jwtFromClient) {
          get(`/sidebar/documentG/getDocumentG/${dOId}`, jwtFromClient)
            .then(res => res.json())
            .then(res => {
              const {ok, body, errors} = res
              if (ok) {
                setTitle(body.title)
                setContents(body.contents)
                setIsDBLoad(true)
                setChatBlocks(body.chatBlocks)
              } // BLANK LINE COMMENT:
              else {
                const keys = Object.keys(errors)
                alert(errors[keys[0]])
              }
            })
        }
      })
    }
  }, [dOId, isDBLoad, getJwt])
  // Set sockDoc
  useEffect(() => {
    if (!sockDoc && socketPId && pageOId) {
      const newSocket = io(serverUrl)
      setSockDoc(newSocket)

      sockDocOn_documentGConnected(newSocket)
      sockDocOn_documentGRequestLock(newSocket, setChangeQ)
      sockDocOn_documentGSendChangeInfo(newSocket)
      sockDocOn_documentGChatting(newSocket)

      // 소켓 연결됬다고 서버에 알리는 부분
      getJwt() // BLANK LINE COMMENT:
        .then(jwtFromClient => {
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
  }, [
    sockDoc,
    socketPId,
    pageOId,
    uOId,
    getJwt,
    sockDocOn_documentGConnected,
    sockDocOn_documentGRequestLock,
    sockDocOn_documentGSendChangeInfo,
    sockDocOn_documentGChatting
  ])
  // changeQ 에 수정정보가 있으면 서버에 "수정 요청 신호" 를 보낸다.
  useEffect(() => {
    getJwt() // BLANK LINE COMMENT:
      .then(jwtFromClient => {
        if (jwtFromClient && sockDoc && changeQ && changeQ.length > 0 && !isQWaitingLock && uOId) {
          const payload: SocketDocRequestLockType = {
            jwt: jwtFromClient,
            uOId: uOId,
            dOId: dOId
          }
          sockDoc.emit('documentG request lock', payload)
          setIsQWaitingLock(true)
        }
      })
    // End getJwt()
  }, [changeQ, dOId, isQWaitingLock, sockDoc, uOId, getJwt])
  // Move chat from Queue to page
  useEffect(() => {
    if (chatQ && chatQ.length > 0 && isDBLoad) {
      const newChatQ = [...chatQ]
      setChatBlocks(prev => [...prev, newChatQ.pop() as ChatBlockType])
      setChatQ(newChatQ)
      if (divChatsBodyRef?.current) {
        const {scrollTop, clientHeight, scrollHeight} = divChatsBodyRef.current
        if (scrollTop + clientHeight >= scrollHeight) {
          setGoToBot(true)
        }
      }
    }
  }, [chatQ, isDBLoad, divChatsBodyRef])
  // Move Chat scroll to bottom
  useEffect(() => {
    if (goToBot && divChatsBodyRef?.current) {
      const {scrollTop, clientHeight, scrollHeight} = divChatsBodyRef.current

      console.log(`${scrollTop} + ${clientHeight} ?? ${scrollHeight}`)
      if (scrollTop + clientHeight < scrollHeight) {
        setGoToBot(false)
        divChatsBodyRef.current.scrollTop = scrollHeight
      }
    }
  }, [chatBlocks, divChatsBodyRef, goToBot, setGoToBot])
  // Quit socket
  useEffect(() => {
    return () => {
      if (sockDoc) {
        sockDoc.disconnect()
        setSockDoc(null)
        setIsDBLoad(false)
      }
    }
  }, [dOId, sockDoc, setSockDoc])

  // prettier-ignore
  const value = {
    dOId, setDOId,
    title, setTitle,
    contents, setContents,
    chatBlocks, setChatBlocks,
    changedContents, setChangedContents,
    isContentsChanged, setIsContentsChanged,

    goToBot, setGoToBot,
    scrollYVal, setScrollYVal,
    scrollYMax, setScrollYMax,

    divChatsBodyRef,

    addInfoToChangeQ,
    chat,
    onBlurTitle,
    onChangeTitle,
  }
  return <DocumentGContext.Provider value={value} children={<DocumentGPage />} />
}

export const useDocumentGContext = () => {
  return useContext(DocumentGContext)
}

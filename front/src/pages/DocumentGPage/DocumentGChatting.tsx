import {ChangeEvent, MouseEvent, useCallback, useState} from 'react'
import {Icon} from '../../components'
import {useAuth, useDocumentGContext} from '../../contexts'
import {get, post} from '../../server'
import {DocAddUserBodyType, DocUserInfoType} from '../../common'

import * as T from '../../components/Base/Texts'

export function DocumentGChatting() {
  const [idOrEmailVal, setIdOrEmailVal] = useState<string>('')
  const [isUserListLoaded, setIsUserListLoaded] = useState<boolean>(false)
  const [showUserList, setShowUserList] = useState<boolean>(false)
  const [userErrMsg, setUserErrMsg] = useState<string>('')
  const [userList, setUserList] = useState<DocUserInfoType[]>([])

  const {dOId} = useDocumentGContext()
  const {getJwt} = useAuth()

  // AREA1: Just function area
  const addUser = useCallback(
    (idOrEmail: string) => {
      if (dOId) {
        getJwt() // BLANK LINE COMMENT:
          .then(jwtFromClient => {
            const payload: DocAddUserBodyType = {
              jwt: jwtFromClient,
              idOrEmail: idOrEmail
            }
            post(`/sidebar/documentG/addUser/${dOId}`, payload)
              .then(res => res.json())
              .then(res => {
                const {ok, body, errors} = res // eslint-disable-line
                if (ok) {
                  //
                } // BLANK LINE COMMENT:
                else {
                  const key = Object.keys(errors)[0]
                  setUserErrMsg(errors[key])
                }
              })
          })
      }
    },
    [dOId, getJwt]
  )
  const closeUserListModal = useCallback(() => {
    setShowUserList(false)
    setIdOrEmailVal('')
    setUserErrMsg('')
    setIsUserListLoaded(false)
  }, [])

  // AREA2: Event function area
  const onChangeInputUserId = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setIdOrEmailVal(e.currentTarget.value)
    setUserErrMsg('')
  }, [])
  const onClickAddUser = useCallback(
    (idOrEmail: string) => (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      addUser(idOrEmail)
    },
    [addUser]
  )
  const onClickErrorMessage = useCallback((e: MouseEvent<HTMLParagraphElement>) => {
    setUserErrMsg('')
  }, [])
  const onClickToggleUserListModal = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation()
      if (showUserList === true) {
        closeUserListModal()
      } // BLANK LINE COMMENT:
      else {
        setShowUserList(true)
        if (dOId) {
          getJwt() // BLANK LINE COMMENT:
            .then(jwtFromClient => {
              get(`/sidebar/documentG/getUsers/${dOId}`, jwtFromClient)
                .then(res => res.json())
                .then(res => {
                  const {ok, body, errors} = res
                  if (ok) {
                    const userInfos = body.userInfos as DocUserInfoType[]
                    userInfos.sort((a, b) => a.email.localeCompare(b.email))
                    setUserList(userInfos)
                    setIsUserListLoaded(true)
                  } // BLANK LINE COMMENT:
                  else {
                    const errKey = Object.keys(errors)[0]
                    setUserErrMsg(errors[errKey])
                  }
                })
            }) // getJwt().then()
        }
      }
    },
    [dOId, showUserList, closeUserListModal, getJwt]
  )

  // AREA3: TSX area
  return (
    <div
      className="flex flex-grow flex-col items-center h-full border-2"
      onClick={e => closeUserListModal()}>
      <div className="BLOCK_USER_LIST flex w-full" style={{height: '10%'}}>
        <Icon
          className="cursor-pointer select-none text-4xl ml-4 mt-auto"
          name="group"
          onClick={onClickToggleUserListModal}
        />
      </div>
      <div className="BLOCK_CHATTING h-4/5 bg-blue-400 w-full relative">
        <div
          className="BLOCK_USER_LIST_BACKGROUND absolute items-center justify-center inset-0 z-20 w-full h-3/5"
          onClick={e => e.stopPropagation()}
          style={{display: showUserList ? 'flex' : 'none'}}>
          <div className="BLOCK_USER_LIST_CENTER flex flex-col w-4/5 h-full border-4 border-gkd-sakura-text bg-white rounded-2xl p-4 ">
            <div className="BLOCK_NEW_USER flex flex-row items-center w-full">
              <div
                className="BLOCK_NEW_USER_TEXT relative flex flex-row items-center border-2"
                style={{width: '85%'}}>
                <input
                  className="outline-none pl-2 pt-1 pb-1 border-none"
                  onChange={onChangeInputUserId}
                  placeholder="new user"
                  type="text"
                  value={idOrEmailVal}
                />
                <p
                  className="ERROR_MESSAGE flex items-center text-red-500 font-bold text-sm absolute right-0 w-auto p-2"
                  onClick={onClickErrorMessage}
                  style={{display: userErrMsg ? 'flex' : 'none'}}>
                  {userErrMsg}
                </p>
              </div>
              <Icon
                className="text-3xl ml-4 select-none cursor-pointer"
                name="group_add"
                onClick={onClickAddUser(idOrEmailVal)}
              />
            </div>
            <div className="DIVIDE_LINE border-t-2 mt-2" />
            <div className="BLOCK_USER_LIST flex flex-col h-5/6 mt-2 overflow-y-scroll">
              {isUserListLoaded ? (
                userList.map((userInfo, index) => (
                  <T.TextXL>
                    {userInfo.id} : {userInfo.email}
                  </T.TextXL>
                ))
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <p>Loading...</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <p>Show me the chat</p>
      </div>
    </div>
  )
}

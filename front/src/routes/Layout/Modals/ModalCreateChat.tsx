import {ChangeEvent, MouseEvent, useCallback, useState} from 'react'

import {Modal} from '../../../components/Base/Modal'
import {Input} from '../../../components/Base/Inputs'
import {Button} from '../../../components'
import {useAuth, useLayoutModalContext} from '../../../contexts'

import * as T from '../../../components/Base/Texts'
import {get, post} from '../../../server'
import {SidebarBodyType} from '../../../common'

export default function ModalCreateChat() {
  const [idOrEmail, setIdOrMail] = useState<string>('')
  const [errMsg, setErrMsg] = useState<string>('')

  const {isCreateChatOpen, onCreateChatClose} = useLayoutModalContext()
  const {id, uOId, email, checkToken, getJwt} = useAuth()

  const onChangeIdAndErrMsg = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setIdOrMail(e.target.value)
      setErrMsg('')
    },
    [setIdOrMail]
  )

  const onClickClose = useCallback(
    (e: MouseEvent) => {
      onCreateChatClose()
      setIdOrMail('')
      setErrMsg('')
    },
    [onCreateChatClose, setErrMsg, setIdOrMail]
  )

  const onClickTest = useCallback(
    async (e: MouseEvent) => {
      checkToken()
      if (!idOrEmail) {
        setErrMsg('아이디 or 메일주소를 입력해주세요. ')
        return
      }

      const jwt = await getJwt()

      get(`/sidebar/findUser/${idOrEmail}`, jwt)
        .then(res => res.json())
        .then(result => {
          const {ok, body, errors} = result
          if (ok) {
            setErrMsg(`${body.id} is received`)
          } // BLANK LINE COMMENT:
          else {
            const keys = Object.keys(errors)
            keys.includes('jwt') && setErrMsg(errors['jwt'])
            keys.includes('idOrEmail') && setErrMsg(errors['idOrEmail'])
          }
        })
        .catch(error => {
          setErrMsg(`ERROR : ${error.message}`)
        })
    },
    [idOrEmail, checkToken, getJwt, setErrMsg]
  )

  const onClickCreate = useCallback(
    async (e: MouseEvent) => {
      checkToken()

      const jwtFromClient = await getJwt()

      const payload: SidebarBodyType = {
        jwt: jwtFromClient,
        id: id,
        uOId: uOId,
        email: email
      }
      post(`/sidebar/createSingleChatRoom/${idOrEmail}`, payload)
        .then(res => res.json())
        .then(res => {
          const {ok, errors} = res
          if (ok) {
            onClickClose(e)
          } // BLANK LINE COMMENT:
          else {
            const keys = Object.keys(errors)

            setErrMsg(errors[keys[0]])
          }
        })
    },
    [id, uOId, idOrEmail, email, checkToken, getJwt, onClickClose]
  )

  // BLANK LINE COMMENT
  return (
    <Modal className="flex-col" isOpen={isCreateChatOpen}>
      <div className="flex justify-center">
        <T.Title className="font-bold">New Chat</T.Title>
      </div>
      <div className="flex flex-col mt-8">
        <div className="flex flex-row items-center ">
          <T.TextXL className="w-1/4 flex justify-center font-bold">User ID</T.TextXL>
          <Input onChange={onChangeIdAndErrMsg} placeholder="ID or Email" value={idOrEmail}></Input>
        </div>
      </div>
      <p style={{minHeight: '1.5rem'}} className="flex mt-2 text-red-500 justify-center">
        {errMsg}
      </p>
      <div className="flex flex-row mt-4 justify-between pl-8 pr-8">
        <Button className="w-1/4" onClick={onClickCreate}>
          Create
        </Button>
        <Button className="w-1/4" onClick={onClickTest}>
          Test
        </Button>
        <Button className="w-1/4" onClick={onClickClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  )
}

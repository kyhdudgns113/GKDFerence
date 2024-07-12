import {ChangeEvent, MouseEvent, useCallback, useState} from 'react'

import {Modal} from '../../../components/Base/Modal'
import {Input} from '../../../components/Base/Inputs'
import {Button} from '../../../components'
import {useAuth, useLayoutModalContext} from '../../../contexts'

import * as T from '../../../components/Base/Texts'
import {get} from '../../../server'

export default function ModalTest() {
  const [idOrEmail, setIdOrMail] = useState<string>('')
  const [errMsg, setErrMsg] = useState<string>('')

  const {isTestOpen, onTestClose} = useLayoutModalContext()
  const {checkToken} = useAuth()

  const onChangeId = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setIdOrMail(e.target.value)
    },
    [setIdOrMail]
  )

  const onClickTest = useCallback(
    (e: MouseEvent) => {
      checkToken()
      if (!idOrEmail) {
        setErrMsg('아이디 or 메일주소를 입력해주세요. ')
        return
      }

      const jwt = ''
      get(`/user/find/${idOrEmail}`, jwt)
        .then(res => res.json())
        .then(result => {
          const {ok, body, errors} = result
          if (ok) {
            setErrMsg(`${body.userName} is received`)
          } else {
            setErrMsg(errors['idOrEmail'])
          }
        })
        .catch(error => {
          setErrMsg(`ERROR : ${error.message}`)
        })
    },
    [idOrEmail, checkToken, setErrMsg]
  )

  return (
    <Modal className="flex-col" isOpen={isTestOpen} onClose={onTestClose}>
      <div className="flex justify-center">
        <T.Title className="font-bold">New Chat</T.Title>
      </div>
      <div className="flex flex-col mt-8">
        <div className="flex flex-row items-center ">
          <T.TextXL className="w-1/4 flex justify-center font-bold">User ID</T.TextXL>
          <Input onChange={onChangeId} placeholder="ID or Email" value={idOrEmail}></Input>
        </div>
      </div>
      <p style={{minHeight: '1.5rem'}} className="flex mt-2 text-red-500 justify-center">
        {errMsg}
      </p>
      <div className="flex flex-row mt-4 justify-between pl-8 pr-8">
        <Button className="w-1/4">Create</Button>
        <Button className="w-1/4" onClick={onClickTest}>
          Test
        </Button>
        <Button className="w-1/4">Cancel</Button>
      </div>
    </Modal>
  )
}

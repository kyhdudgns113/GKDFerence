import {Dispatch, SetStateAction} from 'react'
import * as U from '../../utils'
import type {Callback, AuthBodyType} from './types'

export const writeBodyObject = (
  body: AuthBodyType | undefined,
  setId: Dispatch<SetStateAction<string>>,
  setEmail: Dispatch<SetStateAction<string>>,
  setJwt: Dispatch<SetStateAction<string>>,
  callback?: Callback | undefined
) => {
  U.writeStringP('jwt', body?.jwt ?? '').then(() => {
    U.writeStringP('id', body?.id ?? '').then(() => {
      U.writeStringP('email', body?.email ?? '').then(() => {
        setJwt(body?.jwt || '')
        setId(body?.id || '')
        setEmail(body?.email || '')
        callback && callback()
      })
    })
  })
}

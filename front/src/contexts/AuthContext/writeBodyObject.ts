import {Dispatch, SetStateAction} from 'react'
import * as U from '../../utils'
import {AuthBodyType, Callback} from '../../common'

/**
 * It write jwt in local storage too
 *
 * @param body : req body
 * @param setId : id setter function
 * @param setUOId : uOId setter function
 * @param setEmail : email setter function
 * @param callback : callback function if writting is finished.
 */
export const writeBodyObject = (
  body: AuthBodyType | undefined,
  setId: Dispatch<SetStateAction<string>>,
  setUOId: Dispatch<SetStateAction<string>>,
  setEmail: Dispatch<SetStateAction<string>>,
  setJwt: Dispatch<SetStateAction<string>>,
  callback?: Callback | undefined
) => {
  U.writeStringP('jwt', body?.jwt ?? '').then(() => {
    U.writeStringP('id', body?.id ?? '').then(() => {
      U.writeStringP('uOId', body?.uOId ?? '').then(() => {
        U.writeStringP('email', body?.email ?? '').then(() => {
          setId(body?.id || '')
          setUOId(body?.uOId || '')
          setEmail(body?.email || '')
          setJwt(body?.jwt || '')
          callback && callback()
        })
      })
    })
  })
}

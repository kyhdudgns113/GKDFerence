import {Dispatch, SetStateAction} from 'react'
import * as U from '../../utils'
import {AuthBodyType, Callback} from '../../common'

/**
 * It write jwt in local storage too
 *
 * @param body : req body
 * @param setId : id setter function
 * @param set_id : _id setter function
 * @param setEmail : email setter function
 * @param callback : callback function if writting is finished.
 */
export const writeBodyObject = (
  body: AuthBodyType | undefined,
  setId: Dispatch<SetStateAction<string>>,
  set_id: Dispatch<SetStateAction<string>>,
  setEmail: Dispatch<SetStateAction<string>>,
  setJwt: Dispatch<SetStateAction<string>>,
  callback?: Callback | undefined
) => {
  U.writeStringP('jwt', body?.jwt ?? '').then(() => {
    U.writeStringP('id', body?.id ?? '').then(() => {
      U.writeStringP('_id', body?._id ?? '').then(() => {
        U.writeStringP('email', body?.email ?? '').then(() => {
          setId(body?.id || '')
          set_id(body?._id || '')
          setEmail(body?.email || '')
          setJwt(body?.jwt || '')
          callback && callback()
        })
      })
    })
  })
}
